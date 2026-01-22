'use server'
import logger from "./logger";
import { fetchAPI } from "./utils";

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

export async function shorten(newLongUrl: string, recaptchaToken: string): Promise<UrlResponse> {
    logger.info(`shorten: ${newLongUrl}`);
    const isRecaptchaValid = await validateRecaptchaToken(recaptchaToken);
    if (!isRecaptchaValid) {
        return { status: "error", message: "reCAPTCHA verification failed", data: null };
    }
    try {
        const url = `${process.env.URL_BACKEND}/shorten`
        const options: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            cache: "no-cache",
            body: JSON.stringify({ "original_url": newLongUrl }),
        };
        const resp = await fetchAPI(url, options);
        if (resp.status === 400) {
            return { status: "error", message: "Invalid URL", data: null };
        } else if (resp.status === 500) {
            return { status: "error", message: "An unknown error from server occurred, try later", data: null };
        } else if (resp.status !== 200) {
            return { status: "error", message: "Could not shorten URL, try later", data: null };
        }
        const data: UrlResponse = await resp.json();
        return { status: "success", message: null, data: data.data };
    } catch (err) {
        logger.error(`<<<ERROR shorten: ${String(err)}`);
        return { status: "error", message: "An unknown error occurred", data: null };
    }

}

interface ClientInfo {
    userAgent: string;
    referer: string;
    ip: string;
}


export async function GetUrlLongByShortCode(shortCode: string, clientInfo: ClientInfo): Promise<UrlResponse> {
    logger.info(`GetUrlLongByShortCode: ${shortCode}`);
    try {
        const url = `${process.env.URL_BACKEND}/${shortCode}`
        const options: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': clientInfo.userAgent,
                'Referer': clientInfo.referer,
                'X-Forwarded-For': clientInfo.ip,
            },
            method: 'GET',
            cache: "no-cache"
        };
        const resp = await fetchAPI(url, options);
        if (resp.status >= 500) {
            return { status: "error", message: "An unknown error from server occurred, try later", data: null };
        }
        const data: UrlResponse = await resp.json();
        if (data.message == "url not found") {
            return { status: "success", message: null, data: null };
        }
        return { status: "success", message: null, data: data.data };
    } catch (err) {
        logger.error(`<<<ERROR shorten: ${String(err)}`);
        return { status: "error", message: "An unknown error occurred", data: null };
    }
}


export async function GetStatsByShortCode(shortCode: string, startDate: string, endDate: string): Promise<UrlStatsResponse> {
    logger.info(`GetStatsByShortCode: ${shortCode}`);
    try {
        const url = `${process.env.URL_BACKEND}/${shortCode}/stats?date-start=${startDate}&date-end=${endDate}`
        const options: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            cache: "no-cache"
        };
        const resp = await fetchAPI(url, options);
        if (resp.status >= 500) {
            return { status: "error", message: "An unknown error from server occurred, try later", data: null };
        }

        const responseBody: UrlStatsResponse = await resp.json();

        if (responseBody.message == "url not found") {
            return { status: "success", message: null, data: null };
        }
        const urls = responseBody.data;
        return { status: "success", message: null, data: urls };

    } catch (err) {
        logger.error(`<<<ERROR shorten: ${String(err)}`);
        return { status: "error", message: "An unknown error occurred", data: null };
    }
}

export async function CheckKeyAvailability(shortCode: string): Promise<boolean> {
    logger.info(`CheckKeyAvailability: ${shortCode}`);
    try {
        const url = `${process.env.URL_BACKEND}/${shortCode}/exists`
        const options: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            cache: "no-cache"
        };
        const resp = await fetchAPI(url, options);
        if (resp.status != 200) {
            return false;
        }

        const responseBody = await resp.json();
        return !responseBody.data;
    } catch (err) {
        logger.error(`<<<ERROR CheckKeyAvailability: ${String(err)}`);
        return false;
    }
}

export async function UpdateKeyShortURL(shortCodeOld: string, shortCodeNew: string): Promise<UrlResponse> {
    logger.info(`UpdateKeyShortURL -> old: ${shortCodeOld} new: ${shortCodeNew}`);
    try {
        const url = `${process.env.URL_BACKEND}/shorten`
        const options: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PATCH',
            cache: "no-cache",
            body: JSON.stringify({ "short_url_new": shortCodeNew, "short_url_old": shortCodeOld}),
        };
        const resp = await fetchAPI(url, options);
        const responseBody = await resp.json();
        if (resp.status !== 200) {            
            return responseBody
        }        
        return {
            status: "success",
            message: responseBody.message || 'URL updated successfully.',
            data: responseBody.data || null,
        };
    } catch (err) {
        logger.error(`<<<ERROR UpdateKeyShortURL: ${String(err)}`);
        return {
            status: "error",
            message: `An error occurred: ${String(err)}`,
            data: null,
        };
    }
}


export async function validateRecaptchaToken(recaptchaToken: string): Promise<boolean> {
    try {
        const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
        });

        const recaptchaData = await recaptchaResponse.json();
        return recaptchaData.success;
    } catch (error) {
        logger.error('Error validating reCAPTCHA token:', error);
        return false;
    }
}
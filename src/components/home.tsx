"use client";
import Link from "next/link";
export default function Home() {
    return (
        <div>
            <Link href="/" title="Home">
                <h1 className="text-4xl font-bold text-yellow-400">URL Shortener</h1>
            </Link>
            <h3 className="text-gray-500">Simple and Fast</h3>
        </div>
    );
}
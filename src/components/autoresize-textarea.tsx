'use client'
import { useState, forwardRef, useImperativeHandle, ForwardedRef } from 'react';
import { Textarea } from '@/components/ui/textarea';

const AutoResizeTextarea = forwardRef(({ value, onChange, ...props }: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  }, ref) => {
    const [height, setHeight] = useState('auto');

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { target } = event;
      if (target instanceof HTMLTextAreaElement) {
        setHeight('auto');
        setHeight(`${target.scrollHeight}px`);
        onChange(event);
      }
    };

  // Pasar el ref correctamente al elemento textarea
  useImperativeHandle(ref, () => ({
    focus: () => {
      // El componente puede ser enfocado cuando sea necesario
      (ref as React.RefObject<HTMLTextAreaElement>).current?.focus();
    },
  }));

    return (
<Textarea
      {...props}
      ref={ref as ForwardedRef<HTMLTextAreaElement>} // Aseguramos que el ref sea del tipo correcto
      placeholder="Paste your link here"
      value={value || ''}
      onChange={handleInput}
      style={{ height, overflow: 'hidden' }} // Evita la barra de desplazamiento
    />
    );
});

AutoResizeTextarea.displayName = 'AutoResizeTextarea';

export default AutoResizeTextarea;

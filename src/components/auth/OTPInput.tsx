import { useRef, useState, KeyboardEvent, useEffect } from "react";

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  value?: string;
  onChange?: (otp: string) => void;
}

export function OTPInput({ length = 6, onComplete, value, onChange }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync with external value
  useEffect(() => {
    if (value !== undefined) {
      const newOtp = value.split('').slice(0, length);
      while (newOtp.length < length) newOtp.push('');
      setOtp(newOtp);
    }
  }, [value, length]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Call onChange for controlled component
    const otpString = newOtp.join('');
    onChange?.(otpString);

    // Move to next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all fields are filled
    if (otpString.length === length) {
      onComplete?.(otpString);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (isNaN(Number(pastedData[i]))) continue;
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    const lastFilledIndex = Math.min(pastedData.length - 1, length - 1);
    inputRefs.current[lastFilledIndex]?.focus();
    
    if (newOtp.join('').length === length) {
      onComplete?.(newOtp.join(''));
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-11 h-11 sm:w-14 sm:h-14 text-center border-2 border-slate-200 rounded-lg focus:border-primary-blue-600 focus:outline-none focus:ring-2 focus:ring-primary-blue-600/20 transition-all"
          style={{ 
            fontSize: '24px',
            fontWeight: 600,
            borderRadius: '8px'
          }}
        />
      ))}
    </div>
  );
}

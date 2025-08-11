import React, { useEffect, useState, useRef } from 'react';
import { QRCode } from 'qrcode.react';
import './QRCodeGenerator.css';

const CODE_LENGTH = 6;
const CODE_DURATION = 5 * 60 * 1000; // 5 minutes

const QRCodeGenerator = () => {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(CODE_DURATION);
  const timerRef = useRef(null);
  const copyBtnRef = useRef(null);

  // Generate random numeric code
  const generateNumericCode = (length) => {
    let newCode = '';
    for (let i = 0; i < length; i++) {
      newCode += Math.floor(Math.random() * 10);
    }
    return newCode;
  };

  // Generate new QR and code
  const generateNewCode = () => {
    const newCode = generateNumericCode(CODE_LENGTH);
    setCode(newCode);
    setTimeLeft(CODE_DURATION);
  };

  // Countdown timer
  useEffect(() => {
    timerRef.current && clearInterval(timerRef.current);

    const updateCountdown = () => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          generateNewCode();
          return CODE_DURATION;
        }
        return prev - 1000;
      });
    };

    timerRef.current = setInterval(updateCountdown, 1000);

    return () => clearInterval(timerRef.current);
  }, [code]);

  // Format timer
  const formatTime = (ms) => {
    const minutes = String(Math.floor((ms / 1000 / 60) % 60)).padStart(2, '0');
    const seconds = String(Math.floor((ms / 1000) % 60)).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Clipboard copy
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      if (copyBtnRef.current) {
        copyBtnRef.current.textContent = 'Copied!';
        copyBtnRef.current.classList.add('copied');
        setTimeout(() => {
          copyBtnRef.current.textContent = 'Copy Code';
          copyBtnRef.current.classList.remove('copied');
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Init on mount
  useEffect(() => {
    generateNewCode();
  }, []);

  return (
    <div className="container">
      <h1>QR Code Generator</h1>
      <p className="description">Scan the QR code or use the verification code below</p>

      <div className="qr-wrapper">
        <QRCode value={code} size={180} level="H" />
      </div>

      <div className="code-section">
        <div className="code-label">VERIFICATION CODE</div>
        <div className="code-value">{code}</div>
        <div className="timer">
          {timeLeft > 0 ? `Expires in ${formatTime(timeLeft)}` : 'Code expired!'}
        </div>
      </div>

      <div className="controls">
        <button className="generate-btn" onClick={generateNewCode}>Generate New</button>
        <button className="copy-btn" ref={copyBtnRef} onClick={handleCopy}>Copy Code</button>
      </div>

      <div className="instructions">
        <h3>How to use:</h3>
        <ol>
          <li>Scan the QR code with your device</li>
          <li>Or manually enter the 6-digit verification code</li>
          <li>This code refreshes automatically every 5 minutes</li>
        </ol>
      </div>

      <div className="footer">
        For security purposes, do not share this code with others
      </div>
    </div>
  );
};

export default QRCodeGenerator;

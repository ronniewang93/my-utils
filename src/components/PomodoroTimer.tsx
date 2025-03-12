import React, { useState, useEffect, useRef } from 'react';
import './PomodoroTimer.css';

const PomodoroTimer: React.FC = () => {
    const INITIAL_TIME = 25 * 60;
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [isRunning, setIsRunning] = useState(false);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // 在组件加载时初始化音频
    useEffect(() => {
        const setupAudio = async () => {
            try {
                const audio = new Audio('/sounds/tick.mp3');
                audio.volume = 0.3; // 设置音量为30%，避免声音太大
                audioRef.current = audio;
                
                // 预加载音频
                await audio.load();
                console.log('Audio loaded successfully');
            } catch (error) {
                console.error('Audio setup failed:', error);
            }
        };

        setupAudio();
        
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (isSoundEnabled && audioRef.current) {
                        // 每次播放前重置音频
                        audioRef.current.currentTime = 0;
                        audioRef.current.play().catch(err => {
                            console.error('Failed to play tick sound:', err);
                        });
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isRunning, timeLeft, isSoundEnabled]);

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = (e: React.MouseEvent) => {
        e.stopPropagation();
        setTimeLeft(INITIAL_TIME);
        setIsRunning(false);
    };

    const toggleSound = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSoundEnabled(!isSoundEnabled);
    };

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="pomodoro-container">
            <div className="pomodoro-timer" onClick={toggleTimer}>
                <div className="timer-display">
                    <div className="time">{formatTime(timeLeft)}</div>
                    <div className="status">{isRunning ? '暂停' : '开始'}</div>
                </div>
            </div>
            <div className="controls">
                <button className="reset-button" onClick={resetTimer}>
                    <span className="material-icons">refresh</span>
                </button>
                <button className="sound-button" onClick={toggleSound}>
                    <span className="material-icons">
                        {isSoundEnabled ? 'volume_up' : 'volume_off'}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default PomodoroTimer; 
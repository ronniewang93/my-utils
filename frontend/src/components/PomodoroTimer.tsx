import React, { useState, useEffect, useRef } from 'react';
import './PomodoroTimer.css';
import Modal from './Modal';

const PomodoroTimer: React.FC = () => {
    const INITIAL_TIME = 25 * 60;
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [isRunning, setIsRunning] = useState(false);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editMinutes, setEditMinutes] = useState('25');
    const [showModal, setShowModal] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // 在组件加载时初始化音频
    useEffect(() => {
        const setupAudio = async () => {
            try {
                const audio = new Audio('/sounds/tick.mp3');
                audio.volume = 0.3;
                audioRef.current = audio;
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
                        audioRef.current.currentTime = 0;
                        audioRef.current.play().catch(err => {
                            console.error('Failed to play tick sound:', err);
                        });
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            setShowModal(true);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isRunning, timeLeft, isSoundEnabled]);

    // 当开始编辑时自动聚焦输入框
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const toggleTimer = () => {
        if (!isEditing) {
            setIsRunning(!isRunning);
        }
    };

    const resetTimer = (e: React.MouseEvent) => {
        e.stopPropagation();
        const minutes = parseInt(editMinutes) || 25;
        setTimeLeft(minutes * 60);
        setIsRunning(false);
    };

    const toggleSound = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSoundEnabled(!isSoundEnabled);
    };

    const handleTimeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isRunning) {
            setIsEditing(true);
            setEditMinutes(Math.ceil(timeLeft / 60).toString());
        }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setEditMinutes(value);
    };

    const handleTimeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const minutes = parseInt(editMinutes) || 25;
        setTimeLeft(minutes * 60);
        setIsEditing(false);
    };

    const handleInputBlur = () => {
        handleTimeSubmit({ preventDefault: () => {} } as React.FormEvent);
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
                    {isEditing ? (
                        <form onSubmit={handleTimeSubmit} onClick={e => e.stopPropagation()}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={editMinutes}
                                onChange={handleTimeChange}
                                onBlur={handleInputBlur}
                                className="time-input"
                                maxLength={3}
                            />
                            <div className="time-input-label">分钟</div>
                        </form>
                    ) : (
                        <>
                            <div className="time" onClick={handleTimeClick}>{formatTime(timeLeft)}</div>
                            <div className="status">{isRunning ? '暂停' : '开始'}</div>
                        </>
                    )}
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
            <Modal
                isOpen={showModal}
                message="专注半天了，休息一会吧！"
                onClose={() => setShowModal(false)}
            />
        </div>
    );
};

export default PomodoroTimer; 
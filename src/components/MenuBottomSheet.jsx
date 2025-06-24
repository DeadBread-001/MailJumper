import React, { useState, useEffect, useRef } from 'react';
import MenuBottomSheetHeader from './MenuBottomSheetHeader';
import ScoreSection from './ScoreSection';
import SuperpowerSection from './SuperpowerSection';
import PrizesSection from './PrizesSection';
import RatingSection from './RatingSection';
import PrizeRulesPage from './PrizeRulesPage';
import RatingPage from './RatingPage';
import ModalPrizeRules from './ModalPrizeRules';
import { getTasks } from '../api/admin';
import { getScore, getTopPlayersForUser } from '../api/rating';
import { check } from '../api/auth';
import { getControlTypeKey, getOnboardingKey } from '../utils/deviceDetection';

/**
 * Компонент нижнего меню игры с различными разделами.
 * @param {Object} props
 * @param {boolean} props.isOpen - Открыто ли меню
 * @param {Function} props.onClose - Функция закрытия меню
 * @param {boolean} props.showRatingPage - Показать ли страницу рейтинга
 * @param {Function} props.setShowRatingPage - Функция для переключения страницы рейтинга
 * @param {boolean} props.isSuperpowerExpanded - Развернут ли раздел суперспособностей
 * @param {Function} props.setIsSuperpowerExpanded - Функция для переключения раздела суперспособностей
 * @param {boolean} props.wasSuperpowerJustOpened - Была ли только что открыта суперспособность
 * @param {Function} props.setWasSuperpowerJustOpened - Функция для сброса флага открытия суперспособности
 * @returns {JSX.Element}
 */
const MenuBottomSheet = ({
    isOpen,
    onClose,
    showRatingPage,
    setShowRatingPage,
    isSuperpowerExpanded,
    setIsSuperpowerExpanded,
    wasSuperpowerJustOpened,
    setWasSuperpowerJustOpened,
}) => {
    const [score, setScore] = useState(0);
    const [showPrizeRules, setShowPrizeRules] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tasks, setTasks] = useState([]);
    const superpowerRef = useRef(null);
    const [vkid, setVkid] = useState(null);
    const [ratingData, setRatingData] = useState([]);
    const [ratingLoading, setRatingLoading] = useState(true);
    const [currentPos, setCurrentPos] = useState(null);
    const [selectedControlType, setSelectedControlType] = useState(
        () => localStorage.getItem(getControlTypeKey()) || ''
    );
    const [prizeRulesInfo, setPrizeRulesInfo] = useState(null);

    /**
     * Загружает данные при открытии меню.
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                setRatingLoading(true);
                const tasksData = await getTasks();
                const userData = await check();
                setVkid(userData.vkid);
                setTasks(tasksData);
                if (userData.vkid) {
                    const scoreData = await getScore(userData.vkid);
                    const data = await getTopPlayersForUser(userData.vkid, 1);
                    setRatingData(data.users);
                    setCurrentPos(data.current_pos);
                    setScore(scoreData);
                }
            } catch (err) {
                console.error('Ошибка при получении данных:', err);
            } finally {
                setRatingLoading(false);
            }
        };
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    /**
     * Управляет видимостью модального окна.
     */
    useEffect(() => {
        if (showModal) {
            setIsModalVisible(true);
        } else if (isModalVisible) {
            const timer = setTimeout(() => setIsModalVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [showModal]);

    /**
     * Прокручивает к разделу суперспособностей при его открытии.
     */
    useEffect(() => {
        if (
            wasSuperpowerJustOpened &&
            isSuperpowerExpanded &&
            superpowerRef.current
        ) {
            superpowerRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
            setWasSuperpowerJustOpened(false);
        }
    }, [
        wasSuperpowerJustOpened,
        isSuperpowerExpanded,
        setWasSuperpowerJustOpened,
    ]);

    /**
     * Открывает модальное окно.
     */
    const handleOpenModal = () => setShowModal(true);

    /**
     * Закрывает модальное окно.
     */
    const handleCloseModal = () => setShowModal(false);

    /**
     * Переключает состояние раздела суперспособностей.
     */
    const toggleSuperpower = () => {
        setIsSuperpowerExpanded(!isSuperpowerExpanded);
    };

    const handleControlTypeChange = (e) => {
        setSelectedControlType(e.target.value);
        localStorage.setItem(getControlTypeKey(), e.target.value);
        window.location.reload();
    };

    const handleRestartOnboarding = () => {
        localStorage.removeItem(getOnboardingKey());
        window.location.reload();
    };

    return (
        <div
            className={`menu-bottom-sheet${isOpen ? ' menu-bottom-sheet_open' : ''}${showModal ? ' menu-bottom-sheet_modal' : ''}`}
        >
            <div className="menu-bottom-sheet__backdrop" onClick={onClose} />
            <div className="menu-bottom-sheet__content">
                {showPrizeRules ? (
                    <PrizeRulesPage
                        onBack={() => setShowPrizeRules(false)}
                        onShowModal={(rules) => {
                            setPrizeRulesInfo(rules);
                            setShowModal(true);
                        }}
                    />
                ) : showRatingPage ? (
                    <RatingPage
                        vkid={vkid}
                        onBack={() => setShowRatingPage(false)}
                    />
                ) : (
                    <>
                        <MenuBottomSheetHeader onClose={onClose} />
                        <ScoreSection userScore={score} />
                        <SuperpowerSection
                            isSuperpowerExpanded={isSuperpowerExpanded}
                            setIsSuperpowerExpanded={setIsSuperpowerExpanded}
                            tasks={tasks}
                            superpowerRef={superpowerRef}
                            vkid={vkid}
                        />
                        <PrizesSection
                            onShowPrizeRules={() => setShowPrizeRules(true)}
                        />
                        <RatingSection
                            onShowRatingPage={() => setShowRatingPage(true)}
                            vkid={vkid}
                            ratingData={ratingData}
                            loading={ratingLoading}
                            currentPos={currentPos}
                        />
                        <div className="menu-bottom-sheet__section menu-bottom-sheet__onboarding">
                            <div className="menu-bottom-sheet__onboarding-info">
                                <div className="menu-bottom-sheet__onboarding-title">
                                    Онбординг
                                </div>
                                <div className="menu-bottom-sheet__onboarding-desc">
                                    Если хочешь выбрать другой тип управления —
                                    запусти онбординг заново.
                                </div>
                            </div>
                            <button
                                className="menu-bottom-sheet__onboarding-btn"
                                onClick={handleRestartOnboarding}
                            >
                                Запустить онбординг заново
                            </button>
                        </div>
                    </>
                )}
            </div>
            {isModalVisible && (
                <ModalPrizeRules
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    rules={prizeRulesInfo}
                />
            )}
        </div>
    );
};

export default MenuBottomSheet;

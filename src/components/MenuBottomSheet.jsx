import React, { useState, useEffect, useRef } from 'react';
import MenuBottomSheetHeader from './MenuBottomSheetHeader';
import ScoreSection from './ScoreSection';
import SuperpowerSection from './SuperpowerSection';
import PrizesSection from './PrizesSection';
import RatingSection from './RatingSection';
import PrizeRulesPage from './PrizeRulesPage';
import RatingPage from './RatingPage';
import ModalPrizeRules from './ModalPrizeRules';
import { getTasks } from '../api/tasks';
import { getScore, getTopPlayersForUser } from '../api/rating';
import { check } from '../api/auth';

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

    useEffect(() => {
        if (showModal) {
            setIsModalVisible(true);
        } else if (isModalVisible) {
            const timer = setTimeout(() => setIsModalVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [showModal]);

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

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const toggleSuperpower = () => {
        setIsSuperpowerExpanded(!isSuperpowerExpanded);
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
                        onShowModal={() => setShowModal(true)}
                    />
                ) : showRatingPage ? (
                    <RatingPage
                        vkid={vkid}
                        onBack={() => setShowRatingPage(false)} />
                ) : (
                    <>
                        <MenuBottomSheetHeader onClose={onClose} />
                        <ScoreSection
                            userScore={score}
                        />
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
                    </>
                )}
            </div>
            {isModalVisible && (
                <ModalPrizeRules
                    isOpen={showModal}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default MenuBottomSheet;

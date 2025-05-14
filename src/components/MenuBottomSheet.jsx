import React, { useState, useEffect, useRef } from 'react';
import MenuBottomSheetHeader from './MenuBottomSheetHeader';
import ScoreSection from './ScoreSection';
import SuperpowerSection from './SuperpowerSection';
import PrizesSection from './PrizesSection';
import RatingSection from './RatingSection';
import PrizeRulesPage from './PrizeRulesPage';
import RatingPage from './RatingPage';
import ModalPrizeRules from './ModalPrizeRules';

const MenuBottomSheet = ({
    isOpen,
    onClose,
    userPlace,
    userScore,
    userRank,
    userTasks,
    userTotal,
    showRatingPage,
    setShowRatingPage,
    isSuperpowerExpanded,
    setIsSuperpowerExpanded,
    wasSuperpowerJustOpened,
    setWasSuperpowerJustOpened,
}) => {
    const [showPrizeRules, setShowPrizeRules] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const superpowerRef = useRef(null);

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

    const tasks = [
        {
            id: 1,
            text: 'Включить автозагрузку в приложении Облака',
            icon: '⚡',
        },
        {
            id: 2,
            text: 'Включить уведомления в приложении Почты',
            icon: '📫',
        },
        {
            id: 3,
            text: 'Посмотреть сторис в приложении Облака',
            icon: '👀',
        },
    ];

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
                    <RatingPage onBack={() => setShowRatingPage(false)} />
                ) : (
                    <>
                        <MenuBottomSheetHeader onClose={onClose} />
                        <ScoreSection userScore={userScore} />
                        <SuperpowerSection
                            isSuperpowerExpanded={isSuperpowerExpanded}
                            setIsSuperpowerExpanded={setIsSuperpowerExpanded}
                            tasks={tasks}
                            superpowerRef={superpowerRef}
                        />
                        <PrizesSection
                            onShowPrizeRules={() => setShowPrizeRules(true)}
                        />
                        <RatingSection
                            onShowRatingPage={() => setShowRatingPage(true)}
                        />
                    </>
                )}
            </div>
            {isModalVisible && (
                <ModalPrizeRules
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default MenuBottomSheet;

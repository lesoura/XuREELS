import React, { useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    NativeEventEmitter,
    NativeModules,
    TextInput,
    ActivityIndicator,
    Modal
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { isValidVideo, showEditor } from 'react-native-video-trim';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import FakeNavBar from './FakeNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tooltip from 'react-native-walkthrough-tooltip';

import styles from '../styles/XuREELStyles'

const XuREELS = ({ handleNavigation }) => {
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [loading, setLoading] = useState(false); // Add loading state
    const [showEndingTooltip, setShowEndingTooltip] = useState(false);

    // Tooltip
    const [currentTooltipIndex, setCurrentTooltipIndex] = useState(0);
    const tooltips = [
        {
            content: (
                <>
                    <Text style={{ color: '#F7D091', textAlign: 'center' }}>
                        Welcome to XuREELS!
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => setCurrentTooltipIndex(1)}>
                            <Text style={{ color: 'white', textAlign: 'right', marginRight: 10 }}>
                                Next
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setCurrentTooltipIndex(null)}>
                            <Text style={{ color: 'white', textAlign: 'right' }}>
                                Skip
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            ),
            onClose: () => setCurrentTooltipIndex(1),
        },
        {
            content: (
                <>
                    <Text style={{ color: '#F7D091', textAlign: 'center' }}>
                        Press this to go back
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => setCurrentTooltipIndex(2)}>
                            <Text style={{ color: 'white', textAlign: 'right', marginRight: 10 }}>
                                Next
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setCurrentTooltipIndex(null)}>
                            <Text style={{ color: 'white', textAlign: 'right' }}>
                                Skip
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            ),
            onClose: () => setCurrentTooltipIndex(2),
        },
        {
            content: (
                <>
                    <Text style={{ color: '#F7D091', textAlign: 'center' }}>
                        Press this to open the camera
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => setCurrentTooltipIndex(3)}>
                            <Text style={{ color: 'white', textAlign: 'right', marginRight: 10 }}>
                                Next
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setCurrentTooltipIndex(null)}>
                            <Text style={{ color: 'white', textAlign: 'right' }}>
                                Skip
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            ),
            onClose: () => setCurrentTooltipIndex(3),
        },
        { content: <Text style={{ color: '#F7D091', textAlign: 'center', backgroundColor: 'transparent', borderColor: '#F7D091' }}>This is the navigation bar, the middle is the upload button!</Text>, onClose: () => setCurrentTooltipIndex(null) },
    ];

    useEffect(() => {
        if (currentTooltipIndex === null) {
            // Show the ending tooltip modal when the tutorial is completed
            setShowEndingTooltip(true);
        }
    }, [currentTooltipIndex]);

    useEffect(() => {
        if (currentTooltipIndex !== null) {
            setTimeout(() => {
                setCurrentTooltipIndex(currentTooltipIndex);
            }, 100);
        }
    }, [currentTooltipIndex]);

    useEffect(() => {
        const eventEmitter = new NativeEventEmitter(NativeModules.VideoTrim);
        const subscription = eventEmitter.addListener('VideoTrim', (event) => {
            switch (event.name) {
                case 'onShow': {
                    console.log('onShowListener', event);
                    break;
                }
                case 'onHide': {
                    console.log('onHide', event);
                    break;
                }
                case 'onStartTrimming': {
                    console.log('onStartTrimming', event);
                    break;
                }
                case 'onFinishTrimming': {
                    const trimmedVideo = {
                        id: Date.now(),
                        uri: event.outputPath,
                        paused: false,
                    };

                    // Fetch the existing videos from AsyncStorage
                    AsyncStorage.getItem('processedVideos')
                        .then((storedVideos) => {
                            let updatedVideos = [];

                            // If there are existing videos, parse and append the new video
                            if (storedVideos) {
                                updatedVideos = JSON.parse(storedVideos);
                            }

                            updatedVideos.push(trimmedVideo);

                            // Update the selectedVideos state with the new array of videos
                            setSelectedVideos(updatedVideos);

                            // Store the updated videos in AsyncStorage
                            AsyncStorage.setItem('processedVideos', JSON.stringify(updatedVideos))
                                .then(() => console.log('Videos stored successfully'))
                                .catch((error) => console.log('Error storing videos:', error));
                        })
                        .catch((error) => console.log('Error fetching videos from AsyncStorage:', error));

                    break;
                }
                case 'onCancelTrimming': {
                    console.log('onCancelTrimming', event);
                    break;
                }
                case 'onError': {
                    console.log('onError', event);
                    break;
                }
            }
        });

        // Fetch stored videos from AsyncStorage when the component mounts
        AsyncStorage.getItem('processedVideos')
            .then((storedVideos) => {
                if (storedVideos) {
                    setSelectedVideos(JSON.parse(storedVideos));
                }
            })
            .catch((error) => console.log('Error fetching videos from AsyncStorage:', error));

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        // Log the contents of AsyncStorage whenever selectedVideos changes
        AsyncStorage.getItem('processedVideos')
            .then((storedVideos) => {
                console.log('AsyncStorage Content:', storedVideos);
            })
            .catch((error) => console.log('Error fetching videos from AsyncStorage:', error));
    }, [selectedVideos]);

    const handleCloseEndingTooltip = () => {
        setShowEndingTooltip(false);
    };

    const handleTogglePlay = (id) => {
        const updatedVideos = selectedVideos.map((video) => {
            return {
                ...video,
                paused: video.id === id ? !video.paused : false, // Set paused to false for auto-play
            };
        });
        setSelectedVideos(updatedVideos);
    };

    const handleSelectVideo = async () => {
        try {
            setLoading(true); // Set loading to true before launching image library
            const result = await launchImageLibrary({
                mediaType: 'video',
                assetRepresentationMode: 'current',
            });

            if (result?.assets && result.assets[0]?.uri) {
                isValidVideo(result.assets[0].uri).then((res) => console.log(res));

                // Hide loading screen before showing the editor
                setLoading(false);

                showEditor(result.assets[0].uri, {
                    maxDuration: 20,
                });
            } else {
                setLoading(false); // Hide loading screen in case of invalid video selection
                console.log('Invalid video selection');
            }
        } catch (error) {
            setLoading(false); // Hide loading screen in case of an error
            console.log('Error selecting video:', error);
        }
    };

    const handleToggleHype = (id) => {
        // Find the index of the video in the selectedVideos array
        const videoIndex = selectedVideos.findIndex((video) => video.id === id);

        // Check if the video is found in the array
        if (videoIndex !== -1) {
            // Create a copy of the selectedVideos array
            const updatedVideos = [...selectedVideos];

            // Toggle between 'hypes.png' and 'hypeg.png' based on the current state
            updatedVideos[videoIndex] = {
                ...updatedVideos[videoIndex],
                iconSource: updatedVideos[videoIndex].iconSource === require('../src/hypes.png')
                    ? require('../src/hypeg.png')
                    : require('../src/hypes.png'),
                subLabelColor: updatedVideos[videoIndex].subLabelColor === '#FFFFFF'
                    ? '#E2BF85'  // Set your gold color here
                    : '#FFFFFF',
                subLabelText: updatedVideos[videoIndex].subLabelText === 'Hype'
                    ? 'Hyped'
                    : 'Hype',
            };

            // Update the selectedVideos state with the modified array
            setSelectedVideos(updatedVideos);

            // Save the updated videos to AsyncStorage
            AsyncStorage.setItem('processedVideos', JSON.stringify(updatedVideos))
                .then(() => console.log('Videos stored successfully'))
                .catch((error) => console.log('Error storing videos:', error));
        }
    };

    return (
        <View style={styles.container}>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#E2BF85" />
                </View>
            )}

            {/* Row container for XuREELS, left arrow, and camera */}
            <View style={styles.rowContainer}>

                <Tooltip
                    isVisible={currentTooltipIndex === 1}
                    content={tooltips[1].content}
                    onClose={() => {
                        console.log('Closing Tooltip 1');
                        setCurrentTooltipIndex(2);
                    }}
                    placement={'bottom'}
                >
                    <FastImage
                        source={require('../assets/left-arrow.png')}
                        style={styles.leftArrowIcon}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </Tooltip>

                {/* XuREELS label in the center */}
                <Tooltip
                    isVisible={currentTooltipIndex === 0}
                    content={tooltips[0].content}
                    onClose={() => {
                        console.log('Closing Tooltip 0');
                        setCurrentTooltipIndex(1);
                    }}
                    tooltipStyle={{ position: "absolute", right: 0, top: 350 }}
                    placement={'bottom'}
                >
                    <View style={styles.xuReelsLabel}>
                        <Text style={styles.labelText}>XuREELS</Text>
                    </View>
                </Tooltip>

                <Tooltip
                    isVisible={currentTooltipIndex === 2}
                    content={tooltips[2].content}
                    onClose={() => {
                        console.log('Closing Tooltip 2');
                        setCurrentTooltipIndex(3);
                    }}
                    placement={'bottom'}
                >
                    <FastImage
                        source={require('../assets/cam.png')}
                        style={styles.cameraIcon}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </Tooltip>

            </View>

            {/* Swiper component */}
            <Swiper
                loop={false}
                index={selectedVideos.length - 1}
                showsPagination={false}
                onIndexChanged={(index) => console.log(`Swiped to index ${index}`)}
            >
                {selectedVideos.map((item, index) => (
                    <TouchableOpacity
                        key={item.id ? item.id.toString() : 'undefined'}
                        style={styles.videoContainer}
                        onPress={() => handleTogglePlay(item.id)}
                    >
                        {item.uri ? (
                            <React.Fragment>
                                <Video
                                    source={{ uri: item.uri }}
                                    style={styles.video}
                                    controls={false}
                                    resizeMode="cover"
                                    paused={item.paused}
                                />
                                {/* Column of icons */}
                                <View style={styles.iconColumn}>
                                    {/* Munchkin image */}
                                    <FastImage
                                        source={require('../src/munchkin.gif')}
                                        style={styles.munchkinImage}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                    {/* Name text */}
                                    <Text style={styles.nameText}>Munchkin</Text>

                                    {/* Other icons */}
                                    <TouchableOpacity
                                        onPress={() => handleToggleHype(item.id)}
                                    >
                                        <FastImage
                                            source={item.iconSource || require('../src/hypes.png')}
                                            style={styles.icon}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                        {/* Sublabel */}
                                        <Text style={{ ...styles.subLabel, color: item.subLabelColor || '#FFFFFF' }}>
                                            {item.subLabelText || 'Hype'}
                                        </Text>
                                    </TouchableOpacity>
                                    <FastImage
                                        source={require('../src/comment.png')}
                                        style={styles.icon}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                    {/* Sublabel */}
                                    <Text style={styles.subLabel}>Comment</Text>
                                    <FastImage
                                        source={require('../src/sharew.png')}
                                        style={styles.icon}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                    {/* Sublabel */}
                                    <Text style={styles.subLabel}>Send</Text>
                                    <FastImage
                                        source={require('../src/option.png')}
                                        style={styles.icon2}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                </View>

                                {/* Text input for leaving a comment */}
                                <View style={styles.commentInputContainer}>
                                    <TextInput
                                        style={styles.commentInput}
                                        placeholder="Leave a comment"
                                        placeholderTextColor="#FFFFFF"
                                    />
                                </View>

                            </React.Fragment>
                        ) : (
                            <Text>Invalid Video Source</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </Swiper>

            {/* FakeNavBar at the bottom */}
            <Tooltip
                isVisible={currentTooltipIndex === 3}
                content={tooltips[3].content}
                onClose={tooltips[3].onClose}
                placement={'top'}
                tooltipStyle={{ position: "absolute", left: 23, right: 0, top: 600 }}
                backgroundStyle={{ backgroundColor: 'transparent' }}
                backgroundColor='transparent'
            >
                <FakeNavBar handleSelectVideo={handleSelectVideo} />
            </Tooltip>

            {/* Ending Tooltip Modal */}
            <Modal
                transparent={true}
                visible={showEndingTooltip}
                animationType="fade"
                onRequestClose={handleCloseEndingTooltip}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>Enjoy and hype up!</Text>
                    <TouchableOpacity onPress={handleCloseEndingTooltip}>
                        <Text style={styles.closeButton}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

        </View >
    );
};

export default XuREELS;
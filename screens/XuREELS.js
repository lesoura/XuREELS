import React, { useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    NativeEventEmitter,
    NativeModules,
    TextInput
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { isValidVideo, showEditor } from 'react-native-video-trim';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import FakeNavBar from './FakeNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const XuREELS = ({ handleNavigation }) => {
    const [selectedVideos, setSelectedVideos] = useState([]);

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

    const handleTogglePlay = (id) => {
        const updatedVideos = selectedVideos.map((video) => {
            return {
                ...video,
                paused: video.id === id ? !video.paused : true,
            };
        });
        setSelectedVideos(updatedVideos);
    };

    const handleSelectVideo = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'video',
                assetRepresentationMode: 'current',
            });

            if (result?.assets && result.assets[0]?.uri) {
                isValidVideo(result.assets[0].uri).then((res) => console.log(res));

                showEditor(result.assets[0].uri, {
                    maxDuration: 20,
                });
            } else {
                console.log('Invalid video selection');
            }
        } catch (error) {
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
            {/* Row container for XuREELS, left arrow, and camera */}
            <View style={styles.rowContainer}>
                {/* Left arrow icon on the left */}
                <FastImage
                    source={require('../assets/left-arrow.png')}
                    style={styles.leftArrowIcon}
                    resizeMode={FastImage.resizeMode.contain}
                />

                {/* XuREELS label in the center */}
                <View style={styles.xuReelsLabel}>
                    <Text style={styles.labelText}>XuREELS</Text>
                </View>

                {/* Camera icon on the right */}
                <FastImage
                    source={require('../assets/cam.png')}
                    style={styles.cameraIcon}
                    resizeMode={FastImage.resizeMode.contain}
                />
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
                                        <Text style={styles.subLabel}>Hype</Text>
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
            <FakeNavBar handleSelectVideo={handleSelectVideo} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111111',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 1,
    },
    xuReelsLabel: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -35
    },
    leftArrowIcon: {
        width: 35,
        height: 35,
    },
    labelText: {
        color: '#E2BF85',
        fontSize: 18,
    },
    cameraIcon: {
        position: 'absolute',
        right: 0,
        width: 30,
        height: 30,
        zIndex: 1,
    },
    videoContainer: {
        flex: 1,
    },
    video: {
        flex: 1,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30
    },

    // Inside the iconColumn styles
    iconColumn: {
        position: 'absolute',
        bottom: 80,
        right: 5,
        flexDirection: 'column',
        alignItems: 'center',
    },
    icon: {
        width: 30,
        height: 30,
        marginTop: 15,
    },
    icon2: {
        width: 40,
        height: 40,
        marginBottom: 10,
    },
    subLabel: {
        color: '#FFFFFF',
        fontSize: 12,
        marginBottom: 5,
        marginTop: 1,
    },

    // Add new styles for the munchkin image and name
    munchkinImage: {
        width: 30,
        height: 30,
        borderRadius: 15, // Adjust as needed
    },
    nameText: {
        color: '#FFFFFF',
        fontSize: 12,
        marginTop: 2,
        backgroundColor: '#202020',
        padding: 5,
        borderRadius: 20
    },

    // Leave a comment
    commentInputContainer: {
        position: 'absolute',
        bottom: 90,
        left: 15,
        opacity: 0.5
    },
    commentInput: {
        width: 300,
        height: 40,
        backgroundColor: '#202020',
        color: '#FFFFFF',
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        paddingLeft: 10,
    },
});

export default XuREELS;
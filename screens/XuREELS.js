import React, { useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    NativeEventEmitter,
    NativeModules,
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

    useEffect(() => {
        // Log the contents of AsyncStorage whenever selectedVideos changes
        AsyncStorage.getItem('processedVideos')
            .then((storedVideos) => {
                console.log('AsyncStorage Content:', storedVideos);
            })
            .catch((error) => console.log('Error fetching videos from AsyncStorage:', error));
    }, [selectedVideos]);

    return (
        <View style={styles.container}>
            {/* XuREELS label on the top left */}
            <View style={styles.xuReelsLabel}>
                <Text style={styles.labelText}>XuREELS</Text>
            </View>

            {/* FastImage on the top right */}
            <FastImage
                source={require('../assets/camg.png')}
                style={styles.cameraIcon}
                resizeMode={FastImage.resizeMode.contain}
            />

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
                            <Video
                                source={{ uri: item.uri }}
                                style={styles.video}
                                controls={false}
                                resizeMode="cover"
                                paused={item.paused}
                            />
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
    xuReelsLabel: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    labelText: {
        color: '#E2BF85',
        fontSize: 18,
    },
    cameraIcon: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 30,
        height: 30,
        zIndex: 1,
    },
    videoContainer: {
        flex: 1,
    },
    video: {
        flex: 1,
    },
});

export default XuREELS;
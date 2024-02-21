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
                    console.log('onFinishTrimming', event);

                    const trimmedVideo = {
                        id: Date.now(),
                        uri: event.outputPath, // Use the outputPath from the event
                        paused: false,
                    };

                    // Update the selectedVideos state with the trimmed video
                    setSelectedVideos([trimmedVideo]);  // Set the latest trimmed video as the only video

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

        return () => {
            subscription.remove();
        };
    }, []);

    const handleTogglePlay = (id) => {
        const updatedVideos = selectedVideos.map((video) =>
            video.id === id ? { ...video, paused: !video.paused } : video
        );
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
                index={selectedVideos.length - 1} // Set the initial index to the last video
                showsPagination={false}
                onIndexChanged={(index) => console.log(`Swiped to index ${index}`)}
            >
                {selectedVideos.map((item, index) => (
                    <TouchableOpacity
                        key={item.id ? item.id.toString() : 'undefined'}
                        style={styles.videoContainer}
                        onPress={() => handleTogglePlay(item.id)}
                    >
                        {index === selectedVideos.length - 1 && item.uri ? ( // Only render the last video in the array
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
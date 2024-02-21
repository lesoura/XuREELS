import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FakeNavBar = ({ onCartAdd, handleSelectVideo }) => {
    const navigation = useNavigation();
    const scaleValue = useRef(new Animated.Value(1)).current;
    const [borderColor, setBorderColor] = useState('#fff');
    const [circleContainerBorderWidth, setCircleContainerBorderWidth] = useState(0);
    const [borderColors, setBorderColors] = useState(['#8a2be2']);
    const [currentColorIndex, setCurrentColorIndex] = useState(0);
    const [circleContainerRotation] = useState(new Animated.Value(0));
    const categoriesImageScale = useRef(new Animated.Value(1)).current;
    const categoriesImageRotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (onCartAdd) {
            onCartAdd(triggerCircleAnimation);
        }
    }, [onCartAdd]);

    const triggerCircleAnimation = () => {
        Animated.timing(scaleValue, {
            toValue: 0.8,
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();

        setBorderColor(borderColors[currentColorIndex]);
        setCurrentColorIndex((prevIndex) =>
            prevIndex === borderColors.length - 1 ? 0 : prevIndex + 1
        );

        Animated.timing(circleContainerRotation, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();

        setCircleContainerBorderWidth(3);

        Animated.parallel([
            Animated.timing(categoriesImageScale, {
                toValue: 0.5,
                duration: 1000,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
            Animated.timing(categoriesImageRotation, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]).start();

        // Set the timeout for 1000 milliseconds
        setTimeout(() => {
            // Ensure that handleSelectVideo is a function before calling it
            if (typeof handleSelectVideo === 'function') {
                handleSelectVideo();
            }
            retractAnimation();
        }, 1000);
    };

    const retractAnimation = () => {
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start(() => {
            setBorderColor('#fff');
            setCircleContainerBorderWidth(0);
            circleContainerRotation.setValue(0);
            categoriesImageScale.setValue(1);
            categoriesImageRotation.setValue(0);
        });
    };

    const handleHomePress = () => {
        navigation.navigate("ProductList");
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.navItem} onPress={handleHomePress}>
                <Image source={require('../src/xhibit.png')} style={[styles.navImage, styles.centerImage]} />
                <Text style={styles.navText}>Xhibit</Text>
            </TouchableOpacity>
            <Animated.View
                style={[
                    styles.circleContainer,
                    {
                        borderColor,
                        borderWidth: circleContainerBorderWidth,
                        transform: [
                            {
                                rotate: circleContainerRotation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '360deg'],
                                }),
                            },
                            {
                                scale: scaleValue,
                            },
                        ],
                    },
                ]}
            >
                <TouchableOpacity
                    style={styles.circleButton}
                    onPress={triggerCircleAnimation}
                >
                    <Image source={require('../src/xure.png')} style={styles.navImage2} />
                </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity style={styles.navItem}>
                <Image source={require('../assets/userg2.png')} style={styles.navImage} />
                <Text style={styles.navText}>Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#202020',
        borderTopWidth: 1,
        borderTopColor: 'black',
        paddingVertical: 10,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 70,
    },
    navItem: {
        alignItems: 'center',
    },
    navImage: {
        width: 30,
        height: 30,
        marginBottom: 5,
    },
    navImage2: {
        width: 70,
        height: 70,
    },
    centerImage: {
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    },
    navText: {
        fontSize: 12,
        color: 'white'
    },
    circleContainer: {
        position: 'relative',
        top: -35,
        borderRadius: 999,
        overflow: 'hidden',
        backgroundColor: '#E2BF85',
        marginLeft: -70,
        marginRight: -70,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 7,
        borderWidth: 0,
    },
    circleButton: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 999,
    },
    backgroundCircle: {
        position: 'absolute',
        top: -80,
        left: -80,
        width: 240,
        height: 240,
        borderRadius: 120,
    },
});

export default FakeNavBar;

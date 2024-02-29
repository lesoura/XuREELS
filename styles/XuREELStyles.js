import { StyleSheet } from 'react-native';

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
        width: 35,
        height: 35,
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
        alignSelf: 'center'
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
        alignSelf: 'center'
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

    // Add a new style for the loading container
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Thank you modal
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalText: {
        fontSize: 20,
        color: 'white',
        marginBottom: 20,
    },
    closeButton: {
        fontSize: 18,
        color: '#E2BF85',
    },

    // Hype modal
    modalContainer2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)', // semi-transparent black background
    },
    fastImageMan: {
        width: 250, // adjust the width as needed
        height: 250, // adjust the height as needed
    },
});

export default styles;

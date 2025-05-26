import { ActivityIndicator, Modal, Text,  View } from "react-native";

interface Props {
    visible: boolean;
    mess?: string;
}

const LoadingModal = (props: Props) => {
    const {visible, mess} = props;

    return (
        <Modal
            visible={visible}
            style={{flex: 1, backgroundColor: 'white'}}
            transparent
            statusBarTranslucent>
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <ActivityIndicator color={'#ffffff'} size={32} />
                    <Text style={{color: 'white'}} >Loading</Text>
                </View>
            </Modal>
    )
}

export default LoadingModal;
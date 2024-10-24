import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Keyboard,
  Image,
  TouchableOpacity,
} from 'react-native';
import PubNub from 'pubnub';
import {connect} from 'react-redux';
import {colors, scaling} from '../../library';
import Header from '../../components/header';
import IndividualMsg from './IndividualMsg';
import moment from 'moment';
import Loader from '../../components/loader';
import {CallerChatNotification} from '../../redux/actions/app.actions';
import {navigations} from '../../constants';
import {FeatherIcons} from '../../../assets';

const {heightScale, widthScale, normalize} = scaling;

const ChatScreen = props => {
  let userId =
    props.userInfoSuccess &&
    props.userInfoSuccess.data &&
    props.userInfoSuccess.data.id;

  let tripId = props?.route?.params?.tripId;
  let jobId = props?.route?.params?.jobId;

  const pubnub = new PubNub({
    publishKey: 'pub-c-9b323ef6-8a3f-455a-8de2-b389ac242f3c',
    subscribeKey: 'sub-c-89925685-8a2e-4342-9541-edefbeb75378',
    uuid: `${userId}`,
  });

  const [channel, setChannel] = useState(tripId);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.postChatFail) {
      console.log('postChatFail...', props.postChatFail);
    }
    if (props.postChatFail) {
      console.log('postChatSuccess...', props.postChatSuccess);
    }
  }, [props.postChatFail, props.postChatSuccess]);

  useEffect(() => {
    setChannel(tripId);
    pubnub.objects.getChannelMetadata(
      {
        channel: tripId,
      },
      (status, response) => {
        pubnub.objects.setChannelMetadata({
          channel: tripId,
          data: {
            name: 'Customer Channel',
            description: 'This channel is for Customer chat',
            custom: {
              crewLastRead: `${response?.data?.custom?.crewLastRead}`,
              vendorLastRead: `${response?.data?.custom?.vendorLastRead}`,
              CustomerLastRead: `${moment().valueOf() * 10000}`,
            },
          },
        });
      },
    );
  }, [tripId, messages, inputText]);

  useEffect(() => {
    pubnub.subscribe({channels: [channel], withPresence: true});

    pubnub.addListener({
      message: function (event) {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            text: event.message.text,
            timetoken: event.timetoken,
            userId: event.message.userId,
            role: event.message.role,
          },
        ]);
      },
      status: statusEvent => {
        if (statusEvent.category === 'PNConnectedCategory') {
          setLoading(false); // Set loading to false when connected to PubNub
        }
      },
    });
    pubnub.history(
      {
        channel: channel,
        count: 100, // Maximum number of messages to return
      },
      (status, response) => {
        if (status.error) {
          console.error(status);
          return;
        }

        const message = response.messages.map(msg => {
          return {
            text: msg.entry.text,
            timetoken: msg.timetoken,
            userId: msg.entry.userId,
            role: msg.entry.role,
          };
        });
        setMessages(message);
      },
    );

    return () => {
      pubnub.unsubscribeAll();
    };
  }, [channel]);

  const handleSendMessage = () => {
    Keyboard.dismiss();
    inputText.trim().length > 0 &&
      pubnub.publish({
        message: {text: inputText, userId: userId, role: 'Customer'},
        channel,
      });

    props.CallerChatNotification({
      entityType: 'USER',
      jobId: jobId,
      message: inputText,
    });
    setInputText('');
  };
  const handleBackButtonPress = () => {
    props.navigation.goBack();
  };
  const ItemSeparatorComponent = () => <View style={styles.separator} />;

  const groupedMessages = messages.reduce((groups, message) => {
    const messageDate = moment(message.timetoken / 10000).format('YYYY-MM-DD');
    if (!groups[messageDate]) {
      groups[messageDate] = [];
    }
    groups[messageDate].push(message);
    return groups;
  }, {});

  const messageGroups = Object.keys(groupedMessages).map(date => ({
    date,
    messages: groupedMessages[date],
  }));

  const renderItem = ({item, index}) => {
    let msgArrlength = item?.messages?.length;
    const messageDate = moment(item.date).format('YYYY-MM-DD');
    const todayDate = moment().format('YYYY-MM-DD');
    const yesterdayDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
    const isToday = messageDate === todayDate;
    const isYesterday = messageDate === yesterdayDate;
    const dateTitle = isToday
      ? 'Today'
      : isYesterday
      ? 'Yesterday'
      : messageDate;
    return (
      <View>
        <Text style={styles.dateTitle}>{dateTitle}</Text>
        {item.messages.map((msg, i) => {
          const messageTime = moment(msg.timetoken / 10000).format('h:mm A');
          const nextMessage = i < msgArrlength && item.messages[i + 1];
          const isSameTimeAsPrev =
            nextMessage &&
            moment(nextMessage.timetoken / 10000).isSame(
              msg.timetoken / 10000,
              'minute',
            );
          const previousTitle =
            i > 0 && item.messages[i - 1].userId === userId
              ? 'self'
              : 'support';

          const isSameTitleAsPrev =
            previousTitle === (msg.userId === userId ? 'self' : 'support');
          const showTime = !isSameTimeAsPrev || i === msgArrlength - 1;
          const showTitle = !isSameTitleAsPrev || i === 0;
          return (
            <IndividualMsg
              key={msg.timetoken}
              index={index}
              type={msg?.userId === userId ? 'self' : 'support'}
              msg={msg.text}
              role={msg.role}
              time={messageTime}
              showTime={showTime}
              showTitle={showTitle}
            />
          );
        })}
      </View>
    );
  };
  return (
    <View style={styles.mainContainer}>
      <Header
        screenName={tripId}
        leftIconPress={handleBackButtonPress}
        backArrow={true}
        container={{
          backgroundColor: colors.white,
          marginBottom: heightScale(15),
        }}
        rightIcon={true}
        rightIconPress={() =>
          props.navigation.navigate(navigations.Notifications)
        }
      />

      <View style={styles.chatAreaView}>
        {loading ? (
          <Loader />
        ) : (
          <FlatList
            data={messageGroups.reverse()}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemSeparatorComponent}
            contentContainerStyle={styles.contentStyle}
            inverted
          />
        )}
      </View>
      <View style={styles.sendMsgView}>
        <View style={styles.messageView}>
          <TextInput
            style={styles.sendInputBox}
            value={inputText}
            onChangeText={text => setInputText(text)}
            placeholder="Type a message"
            onSubmitEditing={handleSendMessage}
            placeholderTextColor={colors.Black1}
          />
          <TouchableOpacity onPress={handleSendMessage}>
            <Image
              source={FeatherIcons}
              style={{height: heightScale(22), width: widthScale(22)}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  chatAreaView: {
    flex: 7,
    //marginVertical: heightScale(10),
    backgroundColor: colors.LightSkyBlue2,
  },
  separator: {
    height: heightScale(10),
  },
  sendMsgView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.LightSkyBlue2,
    height: heightScale(40),
    paddingHorizontal: widthScale(20),
  },
  sendInputBox: {
    flex: 1,
    color: colors.Black1,
    height: heightScale(40),
  },

  sendText: {
    color: colors.white,
  },
  dateTitle: {
    textAlign: 'center',
    marginVertical: heightScale(10),
    color: colors.gray900,
    fontSize: normalize(12),
    fontWeight: '700',
  },
  contentStyle: {
    //paddingBottom: heightScale(50),
  },
  messageView: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthScale(15),
    borderRadius: normalize(20),
  },
});

const mapStateToProps = ({App, Auth}) => {
  const {tripDetailsSuccess, postChatSuccess, postChatFail} = App;
  const {userRole, userInfoSuccess} = Auth;
  return {
    userRole,
    userInfoSuccess,
    tripDetailsSuccess,
    postChatSuccess,
    postChatFail,
  };
};

const mapDispatchToProps = {ChatScreen, CallerChatNotification};

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);

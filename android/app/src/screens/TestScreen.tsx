import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import moment from 'moment-timezone';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Appbar,
  Button,
  Chip,
  Divider,
  SegmentedButtons,
  Text,
  useTheme,
} from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import {useGetGameByIdAndDate} from '../api/games/useGame';
import {timeSlots} from '../constant/timeSlots';
import {isOverlapping, parseTimeRange} from '../hooks/helper';
import {useBookingGames} from '../api/booking/useBooking';
import {useUserStore} from '../store/userStore';
import {Animated} from 'react-native';

const {width} = Dimensions.get('window');

type CarouselRefType = React.ComponentRef<typeof Carousel>;

const calculateBookingDetails = ({
  value,
  selectedDate,
  selectedCourt,
  gameInfo,
}: any) => {
  if (!value.length || !gameInfo?.game?.hourlyPrice) {
    return {
      startTime: '',
      endTime: '',
      totalAmount: 0,
      formattedDate: '',
      nets: selectedCourt || 1,
    };
  }

  const formattedDate = moment(
    `${selectedDate} ${moment().year()}`,
    'D MMM YYYY',
  ).format('YYYY-MM-DD');

  const startTimeRaw = value[0]?.split('-')[0].trim();
  const endTimeRaw = value[value.length - 1]?.split('-')[1].trim();

  const parseTime = (time: string) => {
    if (time === '12 am') return '00:00';
    if (time === '12 pm') return '12:00';
    return time;
  };

  const startTime = parseTime(startTimeRaw);
  const endTime = parseTime(endTimeRaw);

  const nets = selectedCourt || 1;
  const hourlyPrice = gameInfo?.game?.hourlyPrice || 0;

  const start = moment.tz(
    `${formattedDate} ${startTime}`,
    'YYYY-MM-DD HH:mm',
    'Asia/Kolkata',
  );
  const end = moment.tz(
    `${formattedDate} ${endTime}`,
    'YYYY-MM-DD HH:mm',
    'Asia/Kolkata',
  );

  if (end.isBefore(start)) {
    end.add(1, 'day');
  }

  // const durationInMinutes = end.diff(start, 'minutes');
  // const durationInHours = durationInMinutes / 60;

  const totalAmount = hourlyPrice * value.length * nets;

  return {
    startTime,
    endTime,
    totalAmount,
    formattedDate,
    nets,
  };
};

const TestScreen = () => {
  const theme = useTheme();
  const route = useRoute();
  const navigate = useNavigation();

  const {gameId} = route.params as {gameId: string};
  const {mutate, isPending, data: gameInfo} = useGetGameByIdAndDate();
  const {selectedDate, setSelectedDate} = useUserStore();
  const [selectedCourt, setSelectedCourt] = useState<number>(1);

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('Twilight');
  const [value, setValue] = useState([]);

  const carouselRef = useRef<CarouselRefType>(null);

  const [carouselData, setCarouselData] = useState(timeSlots[0].carouselData);

  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [startEndTime, setStartEndTime] = useState({
    startTime: '',
    endTime: '',
  });

  const submitAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(submitAnim, {
      toValue: calculatedAmount ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [calculatedAmount]);

  const submitTranslateY = submitAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const submitOpacity = submitAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const {
    mutate: bookingMutate,
    isSuccess,
    isPending: bookingPending,
  } = useBookingGames();

  useEffect(() => {
    const formattedDate = moment(
      selectedDate + ' ' + moment().year(),
      'D MMM YYYY',
    ).format('YYYY-MM-DD');
    mutate({gameId, date: formattedDate});
  }, [mutate, gameId, selectedDate, isSuccess]);

  useEffect(() => {
    const {totalAmount, startTime, endTime} = calculateBookingDetails({
      value,
      selectedDate,
      selectedCourt,
      gameInfo,
    });

    if (totalAmount !== calculatedAmount) {
      setCalculatedAmount(totalAmount);
    }

    if (
      startTime !== startEndTime.startTime ||
      endTime !== startEndTime.endTime
    ) {
      setStartEndTime({startTime, endTime});
    }
  }, [
    value,
    gameInfo,
    selectedCourt,
    selectedDate,
    selectedTimeSlot,
    carouselData,
    calculatedAmount,
    startEndTime,
  ]);

  const today = moment();
  const next30Days = Array.from({length: 31}, (_, i) =>
    today.clone().add(i, 'days'),
  );

  const handleTimeSlotSelection = (timeSlot: string, index: number) => {
    setSelectedTimeSlot(timeSlot);
    const selected = timeSlots[index];
    if (selected) {
      setCarouselData(selected.carouselData);
      carouselRef.current?.scrollTo({index, animated: true});
    }
  };

  const handleCarouselSnap = (index: number) => {
    setSelectedTimeSlot(timeSlots[index].slot);
    setCarouselData(timeSlots[index].carouselData);
  };

  const handleSubmit = () => {
    const {startTime, endTime, totalAmount, formattedDate, nets} =
      calculateBookingDetails({
        value,
        selectedDate,
        selectedCourt,
        gameInfo,
      });

    console.log('total amount>>>', totalAmount);
    const bookingPayload = {
      startTime,
      endTime,
      nets,
      totalAmount,
      gameId,
      date: formattedDate,
    };

    console.log('bookinggg', bookingPayload);

    bookingMutate(bookingPayload);

    setValue([]);
    setSelectedCourt(1);
    carouselRef.current?.scrollTo({index: 0, animated: false});
  };

  const renderItem = ({item}: {item: any}) => {
    if (isPending) {
      return (
        <View style={styles.skeletonContainer}>
          <View style={styles.skeletonBox}>
            <View style={styles.skeletonTextLine} />
          </View>
          <View style={styles.skeletonBox}>
            <View style={styles.skeletonTextLine} />
          </View>
        </View>
      );
    }

    const handleValueChange = (newValue: any) => {
      const getHour = (timeRange: any) => {
        const [start] = timeRange?.split('-');
        return parseInt(start.trim(), 10);
      };

      const newSlot = newValue[newValue.length - 1];
      const newHour = getHour(newSlot);

      if (value.length === 0) {
        setValue([newSlot]);
        return;
      }

      const selectedHours = value.map(getHour);
      const minHour = Math.min(...selectedHours);
      const maxHour = Math.max(...selectedHours);

      if (newHour === minHour - 1 || newHour === maxHour + 1) {
        const updated = [...value, newSlot]
          .filter((v, i, a) => a.indexOf(v) === i)
          .sort((a, b) => getHour(a) - getHour(b));
        setValue(updated);
      } else {
        setValue([newSlot]);
      }
    };

    return (
      <View style={{flex: 1, padding: 10}}>
        <View style={{flex: 1, gap: 20}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {item.carouselData.map((slot: any, index: any) =>
              slot.firstHalf?.map((data: any, subIndex: any) => (
                <Text key={`${index}-${subIndex}`}>{data}</Text>
              )),
            )}
          </View>
          <SegmentedButtons
            multiSelect
            value={value}
            onValueChange={handleValueChange}
            buttons={carouselData.flatMap(
              slot =>
                slot.firstHalf_timeRange?.map(timeRange => {
                  const formattedDate = moment(
                    `${selectedDate} ${moment().year()}`,
                    'D MMM YYYY',
                  ).format('YYYY-MM-DD');
                  const {start: segStart, end: segEnd} = parseTimeRange(
                    timeRange,
                    formattedDate,
                  );

                  const isBooked = gameInfo?.game?.bookings?.some(
                    (booking: any) => {
                      const bookingStart = moment
                        .utc(booking?.startTime)
                        .tz('Asia/Kolkata')
                        .toDate();
                      const bookingEnd = moment
                        .utc(booking?.endTime)
                        .tz('Asia/Kolkata')
                        .toDate();

                      // const totalNets = gameInfo?.game?.net;
                      // const bookedNets = booking.nets;

                      // if (totalNets === bookedNets) {
                      //   return true;
                      // }

                      return isOverlapping(
                        segStart,
                        segEnd,
                        bookingStart,
                        bookingEnd,
                      );
                    },
                  );

                  return {
                    value: timeRange,
                    label: '',
                    disabled: isBooked,
                    style: isBooked
                      ? {backgroundColor: 'red', opacity: 0.5}
                      : undefined,
                  };
                }) || [],
            )}
          />
        </View>
        <View style={{flex: 1, gap: 20}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {item.carouselData.map((slot: any, index: any) =>
              slot.secondHalf?.map((data: any, subIndex: any) => (
                <Text key={`${index}-${subIndex}`}>{data}</Text>
              )),
            )}
          </View>
          <SegmentedButtons
            multiSelect
            value={value}
            onValueChange={handleValueChange}
            buttons={carouselData.flatMap(
              slot =>
                slot.secondHalf_timeRange?.map(timeRange => {
                  const formattedDate = moment(
                    `${selectedDate} ${moment().year()}`,
                    'D MMM YYYY',
                  ).format('YYYY-MM-DD');
                  const {start: segStart, end: segEnd} = parseTimeRange(
                    timeRange,
                    formattedDate,
                  );

                  const isBooked = gameInfo?.game?.bookings.some(booking => {
                    const bookingStart = moment
                      .utc(booking?.startTime)
                      .tz('Asia/Kolkata')
                      .toDate();
                    const bookingEnd = moment
                      .utc(booking?.endTime)
                      .tz('Asia/Kolkata')
                      .toDate();

                    return isOverlapping(
                      segStart,
                      segEnd,
                      bookingStart,
                      bookingEnd,
                    );
                  });

                  return {
                    value: timeRange,
                    label: '',
                    disabled: isBooked,
                    style: isBooked
                      ? {backgroundColor: 'red', opacity: 0.5}
                      : undefined,
                  };
                }) || [],
            )}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: theme.colors.background}}>
        <Appbar.BackAction onPress={() => navigate.goBack()} />
        <Appbar.Content title={gameInfo?.game?.name} />
      </Appbar.Header>

      <View style={styles.content}>
        <View className="p-4 gap-4">
          <Text>No of Courts</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {Array.from({length: gameInfo?.game?.net || 0}, (_, index) => (
              <Chip
                key={index}
                style={{
                  display: 'flex',
                  width: 70,
                  margin: 4,
                  alignItems: 'center',
                  justifyContent: 'center',

                  backgroundColor:
                    selectedCourt === index + 1
                      ? theme.colors.primary
                      : theme.colors.surfaceVariant,
                }}
                textStyle={{
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
                onPress={() => {
                  if (selectedCourt !== index + 1) {
                    setSelectedCourt(index + 1);
                  }
                }}>
                <View style={{width: '100%', alignItems: 'center'}}>
                  <Text style={{color: 'white'}}>{index + 1}</Text>
                </View>
              </Chip>
            ))}
          </View>
        </View>

        <Divider leftInset horizontalInset style={{opacity: 0.2}} bold />
        <View style={styles.section}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {next30Days.map(date => {
              const dateString = date.format('D MMM');
              const isSelected = selectedDate === dateString;
              return (
                <View key={dateString} style={styles.dateButtonContainer}>
                  <Button
                    mode={isSelected ? 'contained' : 'text'}
                    onPress={() => {
                      setSelectedDate(dateString);
                      setValue([]);
                      // mutate({gameId, date: formattedDate});
                    }}>
                    <View style={styles.dateButtonContent}>
                      <Text
                        variant="bodyMedium"
                        style={
                          isSelected
                            ? undefined
                            : {color: theme.colors.secondary}
                        }>
                        {date.format('ddd')}
                      </Text>
                      <Text
                        variant="bodyMedium"
                        style={
                          isSelected
                            ? undefined
                            : {color: theme.colors.secondary}
                        }>
                        {date.format('D MMM')}
                      </Text>
                    </View>
                  </Button>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <Divider leftInset horizontalInset style={{opacity: 0.2}} bold />
        <View style={{flex: 1, gap: 20}}>
          <View style={styles.timeSlotContainer}>
            {timeSlots.map((time, index) => {
              const isTimeSelected = selectedTimeSlot === time.slot;
              return (
                <Button
                  key={time.slot}
                  labelStyle={
                    !isTimeSelected && {color: theme.colors.secondary}
                  }
                  mode={isTimeSelected ? 'contained' : 'text'}
                  icon={isTimeSelected ? time.icon : undefined}
                  onPress={() => handleTimeSlotSelection(time.slot, index)}>
                  {time.slot}
                </Button>
              );
            })}
          </View>

          <View style={styles.carouselContainer}>
            <Carousel
              ref={carouselRef}
              width={width}
              height={width / 2}
              autoPlay={false}
              data={timeSlots}
              scrollAnimationDuration={300}
              onSnapToItem={handleCarouselSnap}
              renderItem={renderItem}
              shouldOptimizeUpdates
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxScrollingOffset: 50,
                parallaxAdjacentItemScale: 0.75,
              }}
            />
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 20,
          }}>
          <Divider style={{opacity: 0.2}} bold />

          <Animated.View
            style={{
              transform: [{translateY: submitTranslateY}],
              opacity: submitOpacity,
            }}>
            <View className="flex-row justify-between item-center content-center mt-4 ">
              <View>
                <Text className="text-[17px] font-bold">
                  ₹ {calculatedAmount}
                </Text>
                <Text className="text-[15px]">
                  {startEndTime.startTime} - {startEndTime.endTime}
                </Text>
              </View>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={{height: 40, alignItems: 'center'}}>
                <Text style={{fontWeight: '700'}}>Book Now</Text>
              </Button>
            </View>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
  },
  content: {
    flex: 1,
    gap: 20,
  },
  section: {
    padding: 16,
  },
  dateButtonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  dateButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeSlotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  carouselContainer: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  carouselText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  skeletonContainer: {
    flex: 1,
    padding: 10,
    marginTop: 30,
  },
  skeletonTextLine: {
    height: 40,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
  },
  skeletonBox: {
    flex: 1,
    gap: 20,
  },
});

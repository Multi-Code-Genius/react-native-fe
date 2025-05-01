import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import moment from 'moment-timezone';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Appbar,
  Button,
  Divider,
  SegmentedButtons,
  Text,
  useTheme,
} from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import { useGetGameByIdAndDate } from '../api/games/useGame';
import { timeSlots } from '../constant/timeSlots';
import { isOverlapping, parseTimeRange } from '../hooks/helper';
import { useBookingGames } from '../api/booking/useBooking';
import { useUserStore } from '../store/userStore';

const { width } = Dimensions.get('window');

type CarouselRefType = React.ComponentRef<typeof Carousel>;

const TestScreen = () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { gameId } = route.params as { gameId: string };
  const { mutate, isPending, data: gameInfo } = useGetGameByIdAndDate();
  const { selectedDate, setSelectedDate } = useUserStore();

  const { mutate: bookingMutate, isSuccess } = useBookingGames();

  useEffect(() => {
    const formattedDate = moment(
      selectedDate + ' ' + moment().year(),
      'D MMM YYYY',
    ).format('YYYY-MM-DD');
    mutate({ gameId, date: formattedDate });
  }, [mutate, gameId, selectedDate, isSuccess]);

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('Twilight');
  const [value, setValue] = useState([]);
  const carouselRef = useRef<CarouselRefType>(null);

  const today = moment();
  const next30Days = Array.from({ length: 31 }, (_, i) =>
    today.clone().add(i, 'days'),
  );

  const [carouselData, setCarouselData] = useState(timeSlots[0].carouselData);

  const handleTimeSlotSelection = (timeSlot: string, index: number) => {
    setSelectedTimeSlot(timeSlot);
    const selected = timeSlots[index];
    if (selected) {
      setCarouselData(selected.carouselData);
      carouselRef.current?.scrollTo({ index, animated: true });
    }
  };

  const handleCarouselSnap = (index: number) => {
    setSelectedTimeSlot(timeSlots[index].slot);
    setCarouselData(timeSlots[index].carouselData);
  };

  const handleSubmit = () => {
    const formattedDate = moment(
      `${selectedDate} ${moment().year()}`,
      'D MMM YYYY',
    ).format('YYYY-MM-DD');

    const startTimeRaw = value[0]?.split('-')[0].trim();
    const endTimeRaw = value[value.length - 1]?.split('-')[1].trim();

    const endPeriod = endTimeRaw.toLowerCase().includes('pm') ? 'pm' : 'am';

    const startTime = `${parseInt(startTimeRaw, 10)}${endPeriod}`;
    const endTime = endTimeRaw.replace(' ', '');

    const nets = 2;
    const hourlyPrice = gameInfo?.game?.hourlyPrice;

    const start = moment(`${formattedDate} ${startTime}`, 'YYYY-MM-DD ha');
    const end = moment(`${formattedDate} ${endTime}`, 'YYYY-MM-DD ha');

    const durationInMinutes = end.diff(start, 'minutes');
    const durationInHours = durationInMinutes / 60;

    const totalAmount = hourlyPrice * durationInHours * nets;

    const bookingPayload = {
      startTime,
      endTime,
      nets,
      totalAmount,
      gameId: gameId,
      date: formattedDate,
    };
    console.log('object', bookingPayload);
    bookingMutate(bookingPayload);

    setSelectedDate(moment().format('D MMM'));
    setSelectedTimeSlot('Twilight');
    // setCarouselData(timeSlots[0].carouselData);
    setValue([]);
    carouselRef.current?.scrollTo({ index: 0, animated: false });
  };

  const renderItem = ({ item }: { item: any }) => {
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

    return (
      <View style={{ flex: 1, padding: 10 }}>
        <View style={{ flex: 1, gap: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {item.carouselData.map((slot: any, index: any) =>
              slot.firstHalf?.map((data: any, subIndex: any) => (
                <Text key={`${index}-${subIndex}`}>{data}</Text>
              )),
            )}
          </View>
          <SegmentedButtons
            multiSelect
            value={value}
            onValueChange={setValue}
            buttons={carouselData.flatMap(
              slot =>
                slot.firstHalf_timeRange?.map(timeRange => {
                  const formattedDate = moment(
                    `${selectedDate} ${moment().year()}`,
                    'D MMM YYYY',
                  ).format('YYYY-MM-DD');
                  const { start: segStart, end: segEnd } = parseTimeRange(
                    timeRange,
                    formattedDate,
                  );

                  const isBooked = gameInfo?.game?.bookings?.some(booking => {
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
                      ? { backgroundColor: 'red', opacity: 0.5 }
                      : undefined,
                  };
                }) || [],
            )}
          />
        </View>
        <View style={{ flex: 1, gap: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {item.carouselData.map((slot: any, index: any) =>
              slot.secondHalf?.map((data: any, subIndex: any) => (
                <Text key={`${index}-${subIndex}`}>{data}</Text>
              )),
            )}
          </View>
          <SegmentedButtons
            multiSelect
            value={value}
            onValueChange={setValue}
            buttons={carouselData.flatMap(
              slot =>
                slot.secondHalf_timeRange?.map(timeRange => {
                  const formattedDate = moment(
                    `${selectedDate} ${moment().year()}`,
                    'D MMM YYYY',
                  ).format('YYYY-MM-DD');
                  const { start: segStart, end: segEnd } = parseTimeRange(
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
                      ? { backgroundColor: 'red', opacity: 0.5 }
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
      <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={gameInfo?.game?.name} />
      </Appbar.Header>

      <View style={styles.content}>
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
                      // mutate({gameId, date: formattedDate});
                    }}>
                    <View style={styles.dateButtonContent}>
                      <Text
                        variant="bodyMedium"
                        style={
                          isSelected
                            ? undefined
                            : { color: theme.colors.secondary }
                        }>
                        {date.format('ddd')}
                      </Text>
                      <Text
                        variant="bodyMedium"
                        style={
                          isSelected
                            ? undefined
                            : { color: theme.colors.secondary }
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
        <Divider leftInset horizontalInset style={{ opacity: 0.2 }} bold />
        <View style={{ flex: 1, gap: 20 }}>
          <View style={styles.timeSlotContainer}>
            {timeSlots.map((time, index) => {
              const isTimeSelected = selectedTimeSlot === time.slot;
              return (
                <Button
                  key={time.slot}
                  labelStyle={
                    !isTimeSelected && { color: theme.colors.secondary }
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
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Button mode="contained" onPress={handleSubmit}>
            Submit
          </Button>
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

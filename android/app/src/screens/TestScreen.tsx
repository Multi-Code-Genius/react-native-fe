import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import React, {useRef, useState} from 'react';

import {
  Appbar,
  Button,
  Divider,
  SegmentedButtons,
  Text,
  useTheme,
} from 'react-native-paper';
import {useRoute} from '@react-navigation/native';
import Carousel from 'react-native-reanimated-carousel';
import {timeSlots} from '../constant/timeSlots';
import {useGetGameByIde} from '../api/games/useGame';
import {isOverlapping, parseTimeRange} from '../hooks/helper';
import moment from 'moment';

const {width} = Dimensions.get('window');

type CarouselRefType = React.ComponentRef<typeof Carousel>;

const TestScreen = () => {
  const theme = useTheme();
  const route = useRoute();
  const {gameId} = route.params as {gameId: any};

  const {data: gameInfo} = useGetGameByIde(gameId);
  const [selectedDate, setSelectedDate] = useState(moment().format('D MMM'));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('Twilight');
  const [value, setValue] = useState([]);
  const carouselRef = useRef<CarouselRefType>(null);

  const today = moment();
  const next30Days = Array.from({length: 31}, (_, i) =>
    today.clone().add(i, 'days'),
  );

  const [carouselData, setCarouselData] = useState(timeSlots[0].carouselData);

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
    console.log('Selected Date:', selectedDate);
    console.log('Selected Time Slot:', selectedTimeSlot);
    console.log('Selected Time Ranges:', value);

    // reset to default
    setSelectedDate(moment().format('D MMM'));
    setSelectedTimeSlot('Twilight');
    setCarouselData(timeSlots[0].carouselData);
    setValue([]);
    carouselRef.current?.scrollTo({index: 0, animated: false});
  };

  const renderItem = ({item}: {item: any}) => {
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
            onValueChange={setValue}
            buttons={carouselData.flatMap(
              slot =>
                slot.firstHalf_timeRange?.map(timeRange => {
                  const {start: segStart, end: segEnd} =
                    parseTimeRange(timeRange);

                  const isBooked = gameInfo?.game?.bookings.some(
                    (booking: any) => {
                      const utcTimeStart = booking?.startTime;
                      const utcTimeEnd = booking?.endTime;

                      const hourInIST12Start = moment
                        .utc(utcTimeStart)
                        .tz('Asia/Kolkata')
                        .format('h A');

                      const hourInIST12End = moment
                        .utc(utcTimeEnd)
                        .tz('Asia/Kolkata')
                        .format('h A');

                      const bookStart = hourInIST12Start;
                      const bookEnd = hourInIST12End;

                      return isOverlapping(
                        segStart,
                        segEnd,
                        bookStart,
                        bookEnd,
                      );
                    },
                  );

                  return {
                    value: timeRange,
                    label: timeRange,
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
            onValueChange={setValue}
            buttons={carouselData.flatMap(
              slot =>
                slot.secondHalf_timeRange?.map(timeRange => {
                  const {start: segStart, end: segEnd} =
                    parseTimeRange(timeRange);

                  const isBooked = gameInfo?.game?.bookings.some(booking => {
                    const utcTimeStart = booking?.startTime;
                    const utcTimeEnd = booking?.endTime;

                    const hourInIST12Start = moment
                      .utc(utcTimeStart)
                      .tz('Asia/Kolkata')
                      .format('h A');

                    const hourInIST12End = moment
                      .utc(utcTimeEnd)
                      .tz('Asia/Kolkata')
                      .format('h A');

                    const bookStart = hourInIST12Start;
                    const bookEnd = hourInIST12End;

                    return isOverlapping(segStart, segEnd, bookStart, bookEnd);
                  });

                  return {
                    value: timeRange,
                    label: timeRange,
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
        <Appbar.BackAction />
        <Appbar.Content title={gameInfo.game.name} />
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
                    onPress={() => setSelectedDate(dateString)}>
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
        <View style={{paddingHorizontal: 20, marginBottom: 20}}>
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
});

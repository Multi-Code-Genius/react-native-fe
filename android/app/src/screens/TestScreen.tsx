import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {
  Appbar,
  Button,
  Divider,
  Icon,
  SegmentedButtons,
  Text,
  useTheme,
} from 'react-native-paper';
import moment from 'moment';
import Carousel, {Pagination} from 'react-native-reanimated-carousel';
import {timeSlots} from '../constant/timeSlots';

const {width} = Dimensions.get('window');

const TestScreen = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(moment().format('D MMM'));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('Twilight');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [value, setValue] = React.useState([]);

  const today = moment();
  const next30Days = Array.from({length: 31}, (_, i) =>
    today.clone().add(i, 'days'),
  );

  const [carouselData, setCarouselData] = useState(timeSlots[0].carouselData);

  const handleTimeSlotSelection = (timeSlot: string, index: number) => {
    setSelectedTimeSlot(timeSlot);
    setCurrentIndex(index);
    const selected = timeSlots.find(slot => slot.slot === timeSlot);
    if (selected) {
      setCarouselData(selected.carouselData);
    }
  };

  const handleCarouselSnap = (index: number) => {
    setCurrentIndex(index);
    setSelectedTimeSlot(timeSlots[index].slot);
    setCarouselData(timeSlots[index].carouselData);
  };

  const renderItem = () => {
    return (
      <View style={{flex: 1, padding: 10}}>
        <View style={{flex: 1, gap: 20}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {carouselData.map((slot, index) =>
              slot.firstHalf?.map((data, subIndex) => (
                <Text
                  key={`${index}-${subIndex}`}
                  style={{flexDirection: 'row'}}>
                  {data}
                </Text>
              )),
            )}
          </View>
          <SegmentedButtons
            multiSelect
            value={value}
            onValueChange={setValue}
            buttons={carouselData.flatMap(
              slot =>
                slot.firstHalf_timeRange?.map(data => ({
                  value: data,
                  label: '',
                })) || [],
            )}
          />
        </View>
        <View style={{flex: 1, gap: 20}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {carouselData.map((slot, index) =>
              slot.secondHalf?.map((data, subIndex) => (
                <Text
                  key={`${index}-${subIndex}`}
                  style={{flexDirection: 'row'}}>
                  {data}
                </Text>
              )),
            )}
          </View>
          <SegmentedButtons
            multiSelect
            value={value}
            onValueChange={setValue}
            buttons={carouselData.flatMap(
              slot =>
                slot.secondHalf_timeRange?.map(data => ({
                  value: data,
                  label: '',
                })) || [],
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
        <Appbar.Content title="Double Dribble, Aminjikarai" />
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
              width={width}
              height={width / 2}
              autoPlay={false}
              data={timeSlots}
              scrollAnimationDuration={1000}
              onSnapToItem={handleCarouselSnap}
              renderItem={renderItem}
              defaultIndex={currentIndex}
            />
          </View>
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

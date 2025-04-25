import React from 'react';
import {Text, View} from 'react-native';

export function Header(props: any) {
  const {data} = props;
  return (
    <View className="flex justify-center items-center m-2 ">
      <Text className="text-[15px] font-semibold color-slate-600">
        {data?.video?.user?.name}
      </Text>
      <Text className="text-lg font-semibold">POSTS</Text>
      <View className=" h-[1px] bg-gray-300 w-full mt-2" />
    </View>
  );
}

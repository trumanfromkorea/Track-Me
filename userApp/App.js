import React, { useEffect } from 'react';
import Providers from './navigation';
import { View, ActivityIndicator, LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const App = () => {
  // isLoading 사용자 인증 여부 확인할 것.
  const [isLoading, setIsLoading] = React.useState(true);

  // 로딩 화면 타임설정
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <Providers />
  )
}

export default App;

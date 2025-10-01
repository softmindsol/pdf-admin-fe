
import { Provider } from 'react-redux';
import store from './index';


const ReduxProviderWrapper = ({ children }) => {
  return (
    <Provider store={store}>
      {children}  
    </Provider>
  );
};

export default ReduxProviderWrapper;

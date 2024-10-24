import { format, formatDistance, formatDistanceToNow } from "date-fns";
import { en, hi, or, gu, as, te, ta, ml, kn } from "date-fns/locale";
import React from "react";
import * as RNLocalize from "react-native-localize";
import {
  getPreferredLanguageTag,
  locales as includedLocales,
  setPreferredLanguageTag
} from "../localization";
import * as appApi from "../redux/api/app.api";
import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';
import Config from "react-native-config";
import { NotificationContext } from './notifications'
import NetInfo from "@react-native-community/netinfo";
import { call, compile } from "gullwing";

export const Context = React.createContext();
const dateFnsLocales = {
  en,
  hi,
  or,
  gu,
  as,
  te,
  ta,
  ml,
  kn,
};

class LocalizationProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageTag: getPreferredLanguageTag(),
      country: RNLocalize.getCountry(),
      messages: compile(includedLocales[getPreferredLanguageTag()]),
    };
  }
  async componentDidMount() {
    RNLocalize.addEventListener("change", this.listener);
    const language = await AsyncStorage.getItem("appLanguage");
    if (language) {
      this.setState({
        languageTag: language
      }, () => {
        this.getResources();
      })
    }
    else {
      this.getResources();
    }
  }
  /**
   * Call api to get app text
   * set from storage if their is any error
   */
  getResources = async (languageChanged = false) => {
    //get previous localization text from storage
    const prevJson = await AsyncStorage.getItem("localizationJson")
    try {
      let isConnected =  (await NetInfo.fetch()).isConnected;
      let response = {};
      if(isConnected){
      const result = await appApi.localizationApi(Config.APP_NAME_ENUM_FOR_API, this.state.languageTag);
      response = await result.data || {};
      }
      const { data = [] } = response
      let json = data && data.length && data[0].json;
      let message = {};
      if (json) {
        message = _.merge(includedLocales[this.state.languageTag], json)
      } else if(!languageChanged){
         message = prevJson && JSON.parse(prevJson) || includedLocales[this.state.languageTag];
      }
      else{
         message = includedLocales[this.state.languageTag];
      }
      this.setState({ messages: compile(message) })
      AsyncStorage.setItem("localizationJson", JSON.stringify(message));
    }
    catch (error) {
      console.log("localization error", error);
      let message = {};
      if(!languageChanged){
        message = prevJson && JSON.parse(prevJson) || includedLocales[this.state.languageTag];
     }
     else{
        message = includedLocales[this.state.languageTag];
     }
     this.setState({ messages: compile(message) })
     AsyncStorage.setItem("localizationJson", JSON.stringify(message));
    }
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener("change", this.listener);
  }

  listener = () => {
    const nextLanguageTag = getPreferredLanguageTag([...new Set([...Object.keys(includedLocales)])]);

    if (this.state.languageTag !== nextLanguageTag) {
      this.setState({ languageTag: nextLanguageTag });
    }

    const nextCountry = RNLocalize.getCountry();

    if (this.state.country !== nextCountry) {
      this.setState({ country: nextCountry });
    }
  };
  getStrings = (parameters = {}) => call(this.state.messages, parameters);
  format = (date, pattern) =>
    format(date, pattern, { locale: dateFnsLocales[this.state.languageTag] });
  formatDistance = (date, baseDate) =>
    formatDistance(date, baseDate, {
      locale: dateFnsLocales[this.state.languageTag],
    });
  formatDistanceToNow = (date) =>
    formatDistanceToNow(date, {
      locale: dateFnsLocales[this.state.languageTag],
    });
  formatCurrency = ({ price, currency }) => {
    const locales = RNLocalize.getLocales();
    const languageTag = locales[0].languageTag;

    const formatter = new Intl.NumberFormat(languageTag, {
      style: "currency",
      currency: currency,
    });
    return formatter.format(price);
  };

  setLanguageTag = (value) => {
    if (value) {
      setPreferredLanguageTag(value)
      AsyncStorage.setItem("appLanguage", value);
      this.setState({ languageTag: value }, () => {
        // this.context.register(true);
        this.getResources(true);
      })
    }
  }

  render() {
    const { languageTag, country } = this.state;
    return (
      <Context.Provider
        value={{
          getStrings: this.getStrings,
          format: this.format,
          formatDistance: this.formatDistance,
          formatDistanceToNow: this.formatDistanceToNow,
          formatCurrency: this.formatCurrency,
          country,
          languageTag,
          setLanguageTag: this.setLanguageTag
        }}
        {...this.props}
      />
    );
  }
}
LocalizationProvider.contextType = NotificationContext;
export default LocalizationProvider;

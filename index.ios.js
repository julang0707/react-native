'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  PixelRatio,
  ScrollView,
  NavigatorIOS,
  TouchableHighlight,
  TabBarIOS,
  Component,
} = React;

var API_KEY = 'h9oq2yf3twf4ziejn10b717i';
var API_URL = 'https://api.etsy.com/v2/listings/active';
var PARAMS = '?api_key=' + API_KEY + '&keywords=nashville&includes=Images,Shop';
var REQUEST_URL = API_URL + PARAMS;

var SearchApp = React.createClass({
  render() {
    return(
      <NavigatorIOS
        style={styles.navContainer}
        initialRoute={{
          title: 'Nashville',
          component: ItemsList,
        }}
        />
    );
  }
});

var ItemView = React.createClass({
  onPress () {
    this.props.onPress(this.props.item);
  },
  render() {
    var item = this.props.item;
    return(
      <TouchableHighlight onPress={this.onPress}>
        <View style={styles.container}>
          <Image
            source={{uri: item.Images[0].url_170x135}}
            style={styles.thumbnail}
            />
          <View style={styles.rightContainer}>
            <Text style={styles.title}>
              {item.title.substring(0, 20) + '...'}
            </Text>
            <Text style={styles.shop}>
              {item.Shop.shop_name}
            </Text>
            <Text style={styles.price}>
              {item.price}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
});

var ItemsList = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function() {
    fetch(REQUEST_URL)
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseData.results),
        loaded: true,
      });
    })
    .done();
  },

  onPress(item) {
    this.props.navigator.push({
      title: 'Item Detail',
      component: ItemDetail,
      passProps: {
        item: item
      }
    });
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderItem}
        style={styles.listView}
        />
    );
  },

  renderItem: function(item) {
    return (
      <ItemView item={item} onPress={this.onPress}/>
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading items...
        </Text>
      </View>
    );
  },
});

var ItemDetail = React.createClass ({
  render() {
    var item = this.props.item;

    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainSection}>
          <Image
            source={{uri: item.Images[0].url_fullxfull}}
            style={styles.detailsImage}
            />
          <View style={styles.rightPane}>
            <Text style={styles.itemTitle}>
              {this.props.item.title}
            </Text>
            <Text style={styles.itemShop}>
              {this.props.item.Shop.shop_name}
            </Text>
            <Text style={styles.itemPrice}>
              {this.props.item.price}
            </Text>
          </View>
        </View>
        <View style={styles.separator}/>
        <Text style={styles.itemDescription}>
          {this.props.item.description}
        </Text>
        <View style={styles.separator}/>
        <TouchableHighlight
          style={styles.button}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  navContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 5,
  },
  rightContainer: {
    flex: 1,
  },

  details: {
    paddingTop: 50,
    flex: 1
  },

  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1 / PixelRatio.get(),
    marginVertical: 10,
  },

  title: {
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 10,
  },
  shop: {
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    color: '#78c042',
    marginLeft: 10,
  },
  thumbnail: {
    width: 120,
    height: 95,
    borderRadius: 3,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },

  contentContainer: {
    padding: 10,
  },
  rightPane: {
    justifyContent: 'space-between',
    flex: 1,
  },
  detailsImage: {
    width: 355,
    height: 225,
    resizeMode: 'cover',
    backgroundColor: '#eaeaea',
    marginRight: 10,
  },
  itemTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    marginTop: 5,
  },
  itemShop: {
    marginTop: 10,
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
    color: '#78c042',
    fontWeight: '500',
    marginTop: 10,
  },
  itemDescription: {
    fontSize: 14,
  },

  button: {
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    backgroundColor: '#34A8C4',
    marginBottom: 7,
    padding: 10,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#000',
  },
  buttonText: {
    fontSize: 18,
  },
});

AppRegistry.registerComponent('SearchApp', () => SearchApp);

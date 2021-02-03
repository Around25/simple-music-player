import React from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity } from "react-native";
import Slider from "react-native-slider";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isAlreadyPlay: false,
      duration: '00:00:00',
      timeElapsed: "00:00:00",
      percent: 0,
      current_track: 0,
      inprogress: false,
      playlist: [{
        "title": " Emergence of Talents",
        "path": "track1",
        "cover": "https://images.unsplash.com/photo-1515552726023-7125c8d07fb3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80",
      }, {
        "title": "Shippuden",
        "path": "track2",
        "cover": "https://images.unsplash.com/photo-1542359649-31e03cd4d909?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80",
      }, {
        "title": "Rising Dragon",
        "path": "track3",
        "cover": "https://images.unsplash.com/photo-1512036666432-2181c1f26420?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
      }, {
        "title": "Risking it all",
        "path": "track4",
        "cover": "https://images.unsplash.com/photo-1501761095094-94d36f57edbb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=401&q=80",
      }, {
        "title": "Gekiha",
        "path": "track5",
        "cover": "https://images.unsplash.com/photo-1471400974796-1c823d00a96f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
      }],

    }

    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  }

  changeTime = seconds => {
    // 50 / duration 
    let seektime = (seconds / 100) * this.state.duration;
    this.setState({
      timeElapsed: seektime,
    });
    this.audioRecorderPlayer.seekToPlayer(seektime)
  };

  onStartPlay = async (e) => {
    console.log('onStartPlay');

    this.setState({ isAlreadyPlay: true, inprogress: true })
    const path = this.state.playlist[this.state.current_track].path
    const msg = await this.audioRecorderPlayer.startPlayer(path);
    this.audioRecorderPlayer.setVolume(1.0);

    this.audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        console.log('finished');
        this.audioRecorderPlayer.stopPlayer();
      }
      let percent = (Math.round((Math.floor(e.current_position) / Math.floor(e.duration)) * 100))
      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        timeElapsed: e.current_position,

        percent: percent,
        duration: e.duration
      });
    });
  };
  onPausePlay = async (e) => {
    this.setState({ isAlreadyPlay: false })
    await this.audioRecorderPlayer.pausePlayer();
  };
  canForward = async () => {
    let current_track = this.state.playlist[this.state.current_track]

    if (this.state.playlist.indexOf(current_track) <= this.state.playlist.length) {
      return true
    }
  }
  onForward = async () => {
    let current_track = this.state.playlist[this.state.current_track]
    let current_index = this.state.playlist.indexOf(current_track) + 1
    console.log(current_index)
    if (current_index == this.state.playlist.length) {
      this.setState({ current_track: 0 })
    } else {
      this.setState({ current_track: this.state.current_track + 1 })
    }

    this.onStopPlay().then(() => {
      this.onStartPlay()
    })

  }
  onBackward = async () => {
    let current_track = this.state.playlist[this.state.current_track]
    console.log(current_track)
    let current_index = this.state.playlist.indexOf(current_track) + 1
    console.log(current_index)
    if (current_index == 0) {
      this.setState({ current_track: 5 })
    } else {
      this.setState({ current_track: this.state.current_track - 1 })
    }

    this.onStopPlay().then(() => {
      this.onStartPlay()
    })
  }
  onStopPlay = async (e) => {
    console.log('onStopPlay');
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <View style={{ alignItems: "center", marginTop: 24 }}>
            <Text style={[styles.textLight, { fontSize: 12 }]}>PLAYLIST</Text>
            <Text style={[styles.text, { fontSize: 15, fontWeight: "500", marginTop: 8 }]}>
              Instaplayer
            </Text>
          </View>
          <View style={styles.coverContainer}>
            <Image source={{ uri: this.state.playlist[this.state.current_track].cover }} style={styles.cover}></Image>
          </View>

          <View style={{ alignItems: "center", marginTop: 32 }}>
            <Text style={[styles.textDark, { fontSize: 20, fontWeight: "500" }]}>{this.state.playlist[this.state.current_track].title}</Text>
          </View>
        </View>
        <View style={{ margin: 32 }}>
          <Slider
            minimumValue={0}
            maximumValue={100}
            trackStyle={styles.track}
            thumbStyle={styles.thumb}
            value={this.state.percent}
            minimumTrackTintColor="#93A8B3"
            onValueChange={seconds => this.changeTime(seconds)}
          ></Slider>
          <View style={{ marginTop: -12, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={[styles.textLight, styles.timeStamp]}>{!this.state.inprogress ? this.state.timeElapsed : this.audioRecorderPlayer.mmssss(Math.floor(this.state.timeElapsed))}</Text>
            <Text style={[styles.textLight, styles.timeStamp]}>{!this.state.inprogress ? this.state.duration : this.audioRecorderPlayer.mmssss(Math.floor(this.state.duration))}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16 }}>
          <TouchableOpacity onPress={() => this.onBackward()}>
            <FontAwesome name="backward" size={32} color="#93A8B3" />
          </TouchableOpacity>
          {!this.state.isAlreadyPlay ?
            <TouchableOpacity style={styles.playButtonContainer} onPress={() => this.onStartPlay()}>
              <FontAwesome
                name="play"
                size={32}
                color="#3D425C"
                style={[styles.playButton, { marginLeft: 8 }]}
              />
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.playButtonContainer} onPress={() => this.onPausePlay()}>
              <FontAwesome
                name="pause"
                size={32}
                color="#3D425C"
                style={[styles.playButton, { marginLeft: 8 }]}
              />
            </TouchableOpacity>}
          <TouchableOpacity onPress={() => this.onForward()}>
            <FontAwesome name="forward" size={32} color="#93A8B3" />
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEAEC"
  },
  textLight: {
    color: "#B6B7BF"
  },
  text: {
    color: "#8E97A6"
  },
  textDark: {
    color: "#3D425C"
  },
  coverContainer: {
    marginTop: 32,
    width: 250,
    height: 250,
    shadowColor: "#5D3F6A",
    shadowOffset: { height: 15 },
    shadowRadius: 8,
    shadowOpacity: 0.3
  },
  cover: {
    width: 250,
    height: 250,
    borderRadius: 125
  },
  track: {
    height: 2,
    borderRadius: 1,
    backgroundColor: "#FFF"
  },
  thumb: {
    width: 8,
    height: 8,
    backgroundColor: "#3D425C"
  },
  timeStamp: {
    fontSize: 11,
    fontWeight: "500"
  },
  playButtonContainer: {
    backgroundColor: "#FFF",
    borderColor: "rgba(93, 63, 106, 0.2)",
    borderWidth: 16,
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 32,
    shadowColor: "#5D3F6A",
    shadowRadius: 30,
    shadowOpacity: 0.5
  }
});

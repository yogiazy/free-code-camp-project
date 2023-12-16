!function() {
    "use strict";

    class LengthControl extends React.Component {
        render() {
            return (
                <div className="length-control">
                    <div id={this.props.titleID}>{this.props.title}</div>
                    <button
                        className="btn-level"
                        id={this.props.minID}
                        onClick={this.props.onClick}
                        value="-"
                    >
                        <i className="fa fa-arrow-down fa-2x" />
                    </button>
                    <div className="btn-level" id={this.props.lengthID}>
                        {this.props.length}
                    </div>
                    <button
                        className="btn-level"
                        id={this.props.addID}
                        onClick={this.props.onClick}
                        value="+"
                    >
                        <i className="fa fa-arrow-up fa-2x" />
                    </button>
                </div>
            );
        }
    }

    class Timer extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                brkLength: 5,
                seshLength: 25,
                timerState: "stopped",
                timerType: "Session",
                timer: 1500,
                intervalID: "",
                alarmColor: {
                    color: "white"
                }
            };
            this.setBrkLength = this.setBrkLength.bind(this);
            this.setSeshLength = this.setSeshLength.bind(this);
            this.lengthControl = this.lengthControl.bind(this);
            this.timerControl = this.timerControl.bind(this);
            this.beginCountDown = this.beginCountDown.bind(this);
            this.decrementTimer = this.decrementTimer.bind(this);
            this.phaseControl = this.phaseControl.bind(this);
            this.warning = this.warning.bind(this);
            this.buzzer = this.buzzer.bind(this);
            this.switchTimer = this.switchTimer.bind(this);
            this.clockify = this.clockify.bind(this);
            this.reset = this.reset.bind(this);
            this.pauseTimer = this.pauseTimer.bind(this);
        }

        setBrkLength(e) {
            this.lengthControl(
                "brkLength",
                e.currentTarget.value,
                this.state.brkLength,
                "Session"
            );
        }

        setSeshLength(e) {
            this.lengthControl(
                "seshLength",
                e.currentTarget.value,
                this.state.seshLength,
                "Break"
            );
        }

        lengthControl(e, t, s, i) {
            if ("running" !== this.state.timerState) {
                if (this.state.timerType === i) {
                    "-" === t && 1 !== s
                        ? this.setState({
                              [e]: s - 1
                          })
                        : "+" === t && 60 !== s
                        ? this.setState({
                              [e]: s + 1
                          })
                        : null;
                } else {
                    "-" === t && 1 !== s
                        ? this.setState({
                              [e]: s - 1,
                              timer: 60 * s - 60
                          })
                        : "+" === t && 60 !== s
                        ? this.setState({
                              [e]: s + 1,
                              timer: 60 * s + 60
                          })
                        : null;
                }
            }
        }

        timerControl() {
            "stopped" === this.state.timerState
                ? (this.beginCountDown(),
                  this.setState({
                      timerState: "running"
                  }))
                : (this.setState({
                      timerState: "stopped"
                  }),
                  this.state.intervalID &&
                      clearInterval(this.state.intervalID));
        }

        beginCountDown() {
            this.setState({
                intervalID: setInterval(() => {
                    this.decrementTimer();
                    this.phaseControl();
                }, 1000)
            });
        }

        decrementTimer() {
            this.setState({
                timer: this.state.timer - 1
            });
        }

        phaseControl() {
            let e = this.state.timer;
            this.warning(e);
            this.buzzer(e);
            e < 0 &&
                (clearInterval(this.state.intervalID),
                "Session" === this.state.timerType
                    ? (this.beginCountDown(),
                      this.switchTimer(60 * this.state.brkLength, "Break"))
                    : (this.beginCountDown(),
                      this.switchTimer(60 * this.state.seshLength, "Session")));
        }

        warning(e) {
            e < 61
                ? this.setState({
                      alarmColor: {
                          color: "#a50d0d"
                      }
                  })
                : this.setState({
                      alarmColor: {
                          color: "white"
                      }
                  });
        }

        buzzer(e) {
            0 === e && this.audioBeep.play();
        }

        switchTimer(e, t) {
            this.setState({
                timer: e,
                timerType: t,
                alarmColor: {
                    color: "white"
                }
            });
        }

        clockify() {
            if (this.state.timer < 0) return "00:00";
            let e = Math.floor(this.state.timer / 60),
                t = this.state.timer - 60 * e;
            return (
                (t = t < 10 ? "0" + t : t),
                (e = e < 10 ? "0" + e : e),
                e + ":" + t
            );
        }

        reset() {
            clearInterval(this.state.intervalID);
            this.audioBeep.pause();
            this.audioBeep.currentTime = 0;
            this.setState({
                brkLength: 5,
                seshLength: 25,
                timerState: "stopped",
                timerType: "Session",
                timer: 1500,
                intervalID: "",
                alarmColor: {
                    color: "white"
                }
            });
        }

        pauseTimer() {
            if (this.state.timerState === "running") {
                clearInterval(this.state.intervalID);
                this.setState({
                    timerState: "paused"
                });
            }
        }

        render() {
            return (
                <div>
                    <div className="main-title">Pomodoro Clock</div>
                    <LengthControl
                        addID="break-increment"
                        length={this.state.brkLength}
                        lengthID="break-length"
                        minID="break-decrement"
                        onClick={this.setBrkLength}
                        title="Break Length"
                        titleID="break-label"
                    />
                    <LengthControl
                        addID="session-increment"
                        length={this.state.seshLength}
                        lengthID="session-length"
                        minID="session-decrement"
                        onClick={this.setSeshLength}
                        title="Session Length"
                        titleID="session-label"
                    />
                    <div
                        className="timer"
                        style={this.state.alarmColor}
                    >
                        <div className="timer-wrapper">
                            <div id="timer-label">
                                {this.state.timerType}
                            </div>
                            <div id="time-left">
                                {this.clockify()}
                            </div>
                        </div>
                    </div>
                    <div className="timer-control">
                        <button
                            id="start_stop"
                            onClick={this.timerControl}
                        >
                            <i
                                className={`fa fa-${
                                    this.state.timerState === "running"
                                        ? "pause"
                                        : "play"
                                } fa-2x`}
                            />
                        </button>
                        <button id="reset" onClick={this.reset}>
                            <i className="fa fa-refresh fa-2x" />
                        </button>
                    </div>
                    <audio
                        id="beep"
                        preload="auto"
                        ref={(e) => {
                            this.audioBeep = e;
                        }}
                        src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
                    />
                </div>
            );
        }
    }

    ReactDOM.createRoot(
        document.getElementById("root")
    ).render(<Timer />);
}();

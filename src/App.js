// @flow

import React, { Component } from 'react';
import './App.css';
import lottery from './lottery'
import web3 from './web3'

type Props = {}

type State = {
  manager: string,
  message: string,
  players: Array<Object>,
  balance: string,
  value: string
}

class App extends Component<Props, State> {
  state = {
    manager: '',
    message: '',
    players: [],
    balance: '',
    value: '0.01'
  }

  async componentDidMount () {
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(lottery.options.address)

    this.setState({
      manager,
      players,
      balance
    })
  }

  handleSubmit = async (event: Object) => {
    event.preventDefault()

    const accounts = await web3.eth.getAccounts()

    if (!accounts.length) {
      return this.setState({ message: 'ERROR: No accounts found. Is metamask running and authenticated?' })
    }

    this.setState({ message: 'Sending transaction...' })

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    })

    this.setState({ message: 'Entry successfully received!' })
  }

  handleClick = async (event: Object) => {
    const accounts = await web3.eth.getAccounts()

    if (!accounts.length) {
      return this.setState({ message: 'ERROR: No accounts found. Is metamask running and authenticated?' })
    }

    this.setState({ message: 'Sending transaction...' })

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })

    this.setState({ message: 'Winner successfully picked!' })
  }

  render() {
    const { manager, players, balance } = this.state

    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>This contract is managed by: {manager}</p>
        <p>
          There are {players.length} players signed up for this lottery
          competing to win {web3.utils.fromWei(balance, 'ether')} ether.
        </p>

        <hr />

        <form onSubmit={this.handleSubmit}>
          <h3>Enter the lottery</h3>
          <div>
            <label>Ether required</label>
            <input value={this.state.value} readOnly></input>
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h3>Pick a winner</h3>
        <button onClick={this.handleClick}>Pick Winner</button>

        <hr />

        <h2>{this.state.message}</h2>
      </div>
    );
  }
}

export default App;

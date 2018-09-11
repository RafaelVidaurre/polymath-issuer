import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import BigNumber from 'bignumber.js'
import type { MockStoreEnhanced } from 'redux-mock-store'
import { PolyToken, TickerRegistry } from 'polymathjs'
import * as actions from '../actions'

jest.mock('polymathjs', () => {
  return {
    PolyToken: {
      decimals: 18,
      symbol: 'POLY',
      name: 'Polymath Network',
      allowance: jest.fn(),
      approve: jest.fn(),
    },
    TickerRegistry: {
      registrationFee: jest.fn(() => {
        return 250
      }),
      registerTicker: jest.fn(),
    },
  }
})

const mockedStoreState = {
  pui: {
    account: {
      balance: BigNumber(20000),
    },
  },
  form: {
    ticker: {
      values: {
        ticker: 'FOO',
        name: 'Foo',
      },
    },
  },
  network: {
    account: '0x123',
  },
}

const mockStore = configureMockStore([thunk])

/**
 * - Configure PolyToken mock
 * - Setup mock store's state
 */

describe('Actions: reserve', () => {
  let store: MockStoreEnhanced<any>
  beforeEach(() => {
    PolyToken.allowance.mockImplementation(async () => BigNumber(0))
    PolyToken.approve = jest.fn()
    store = mockStore()
  })
  
  test('requires two transactions by default', async () => {
    PolyToken.allowance.mockImplementation(async () => BigNumber(0))
    store = mockStore(mockedStoreState)

    await store.dispatch(actions.reserve())
    const confirmAction = store.getActions()[0]
    expect(confirmAction.type).toEqual('polymath-ui/modal/CONFIRM')
    await confirmAction.onConfirm()
    const txStartAction = store.getActions()[1]
    expect(txStartAction.type).toEqual('polymath-ui/tx/START')
    expect(txStartAction.titles).toHaveLength(2)
    expect(txStartAction.titles).toEqual(['Approving POLY Spend', 'Reserving Token Symbol'])
  })

  test('skips first transaction if previously executed', async () => {
    PolyToken.allowance.mockImplementation(async () => BigNumber(250))
    store = mockStore(mockedStoreState)

    await store.dispatch(actions.reserve())
    const confirmAction = store.getActions()[0]
    expect(confirmAction.type).toEqual('polymath-ui/modal/CONFIRM')
    await confirmAction.onConfirm()
    const txStartAction = store.getActions()[1]
    expect(txStartAction.type).toEqual('polymath-ui/tx/START')
    expect(txStartAction.titles).toHaveLength(1)
    expect(txStartAction.titles).toEqual(['Reserving Token Symbol'])
    expect(PolyToken.approve).not.toHaveBeenCalled()
    expect(TickerRegistry.registerTicker).toHaveBeenCalled()
  })
  
  test.skip('on success shows success message', () => {
    
  })

  test.skip('on failure shows fail message', () => {
    
  })  
})


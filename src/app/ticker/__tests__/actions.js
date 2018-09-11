import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import BigNumber from 'bignumber.js'
import type { MockStoreEnhanced } from 'redux-mock-store'
import { PolyToken } from 'polymathjs'
import * as actions from '../actions'

jest.mock('polymathjs', () => {
  return {
    PolyToken: {
      decimals: 18,
      symbol: 'POLY',
      name: 'Polymath Network',
      allowance: jest.fn(),
    },
    TickerRegistry: {
      registrationFee: jest.fn(() => {
        return 250
      }),
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
}

const mockStore = configureMockStore([thunk])

/**
 * - Configure PolyToken mock
 * - Setup mock store's state
 */

describe('Actions: reserve', () => {
  let store: MockStoreEnhanced<any>
  beforeEach(() => {
    PolyToken.allowance.mockImplementation(async () => 0)
    store = mockStore()
  })
  
  test('requires two transactions by default', async () => {
    
  })

  // TODO @RafaelVidaurre: This behavior is not expected in this transaction,
  // move to test the other flows where PolyApprove actually occurs... Duh!
  test('skips first transaction if previously executed', async () => {
    PolyToken.allowance.mockImplementation(async () => 250)

    const storeState = { ...mockedStoreState }

    store = mockStore(storeState)

    await store.dispatch(actions.reserve())
    // await store.dispatch(actions.confirm)
    
    /**
     * - Dispatch confirm action
     * - Check action values
     */

    // FIXME: Action is currently untestable. Logic is provided through
    // some callback method in action creator
    // const dispatchedAction = store.getActions()
    
    // expect(dispatchedAction.titles).toEqual(['Minting Tokens'])
  })
  
  test.skip('on success shows success message', () => {
    
  })

  test.skip('on failure shows fail message', () => {
    
  })  
})


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
      allowance: jest.fn()  },
  }
})

const mockedStoreState = {
  token: {
    mint: {
      uploaded: [],
      uploadedTokens: [],
    },
    token: {
      contract: {
        mintMulti: jest.fn(),
        getTransferManager: async () => {
          return {
            modifyWhitelistMulti: jest.fn(),
          }
        },
      },
    },
  },
}

const mockStore = configureMockStore([thunk])

/**
 * - Configure PolyToken mock
 * - Setup mock store's state
 */

describe('Actions: mintTokens', () => {
  let store: MockStoreEnhanced<any>
  beforeEach(() => {
    PolyToken.allowance.mockImplementation(async () => 0)
    store = mockStore()
  })
  
  test('requires two transactions by default', async () => {
    const storeState = { ...mockedStoreState }
    const investorAddresses = [{ address: 'address1' }, { address: 'address2' }]
    const investorTokens = [BigNumber(500), BigNumber(100)]
    const expectedAddresses = investorAddresses.map((investor) => investor.address)

    storeState.token.token.contract.mintMulti = jest.fn()
    storeState.token.mint.uploaded = investorAddresses
    storeState.token.mint.uploadedTokens = investorTokens
    store = mockStore(storeState)
    await store.dispatch(actions.mintTokens())
    const dispatchedAction = store.getActions()[0]
    expect(dispatchedAction.titles).toEqual(['Whitelisting Addresses', 'Minting Tokens'])
    expect(storeState.token.token.contract.mintMulti).toHaveBeenCalledWith(expectedAddresses, investorTokens)
  })

  test.skip('dispatches tx/START action on start ', () => {
    
  })
  
  test.skip('on success shows success message', () => {
    
  })

  test.skip('on failure shows fail message', () => {
    
  })  
})


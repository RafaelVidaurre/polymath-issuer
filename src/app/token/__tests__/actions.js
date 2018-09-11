import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { PolyToken, SecurityTokenRegistry } from 'polymathjs'
import BigNumber from 'bignumber.js'
import type { MockStoreEnhanced } from 'redux-mock-store'
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
    SecurityTokenRegistry: {
      registrationFee: jest.fn(),
      generateSecurityToken: jest.fn(() => ({
        transactionHash: '1234',
      })),
      address: '0x456',
    },
  }
})

const mockedStoreState = {
  pui: {
    account: {
      balance: BigNumber(1000),
    },
  },
  form: {
    'complete_token': {
      values: {

      },
    },
  },
  network: {
    account: '0x123',
  },
  token: {
    mint: {
      uploaded: [],
      uploadedTokens: [],
    },
    token: {
      ticker: 'FOO',
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

describe('Actions(token)', () => { 
  let store: MockStoreEnhanced<any>
  beforeEach(() => {
    store = mockStore()
  })
    
  describe('mintTokens', () => {
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

  describe('issue', () => {
    // TODO @RafaelVidaurre: tests work but an unhandled promise rejection
    // is thrown due to wrong context. This will be fixed on its own
    // by refactoring to testable code

    beforeEach(() => {
      SecurityTokenRegistry.registrationFee.mockImplementation(() => BigNumber(250))
      // PolyToken.approve.mockReset()
    })

    test('requires approve of POLY spend by default', async () => {      
      PolyToken.allowance.mockImplementation(async () => BigNumber(0))
      store = mockStore(mockedStoreState)
      await store.dispatch(actions.issue())
      const confirmAction = store.getActions()[0]
      expect(confirmAction.type).toEqual('polymath-ui/modal/CONFIRM')
      await confirmAction.onConfirm()
      const txStartAction = store.getActions()[1]
      expect(txStartAction.type).toEqual('polymath-ui/tx/START')
      expect(txStartAction.titles).toEqual(['Approving POLY Spend', 'Creating Security Token'])
      expect(SecurityTokenRegistry.generateSecurityToken).toHaveBeenCalledWith(expect.any(Object), false)
    })

    test('doesn\'t require POLY spend approval with sufficient allowance', async () => {
      PolyToken.allowance.mockImplementation(() => BigNumber(250))
      store = mockStore(mockedStoreState)
      await store.dispatch(actions.issue())
      const confirmAction = store.getActions()[0]
      expect(confirmAction.type).toEqual('polymath-ui/modal/CONFIRM')
      await confirmAction.onConfirm()
      const txStartAction = store.getActions()[1]
      expect(txStartAction.type).toEqual('polymath-ui/tx/START')
      expect(txStartAction.titles).toEqual(['Creating Security Token'])
      expect(SecurityTokenRegistry.generateSecurityToken).toHaveBeenCalledWith(expect.any(Object), true)
      expect(PolyToken.approve).not.toHaveBeenCalled()
    })
  })
})


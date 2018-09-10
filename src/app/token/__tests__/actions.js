// import configureMockStore from 'redux-mock-store'
// import thunk from 'redux-thunk'
// import * as poly from 'polymathjs'
// import type { MockStoreEnhanced } from 'redux-mock-store'
// import * as actions from '../actions'

// jest.mock('polymathjs')

// const mockStore = configureMockStore([thunk])

/**
 * - Configure PolyToken mock
 * - Setup mock store's state
 */

describe('Actions: mintTokens', () => {
  // let store: MockStoreEnhanced<any>
  // beforeEach(() => {
  //   store = mockStore()
  // })
  
  test('requires two transactions by default', () => {
    /**
     * - Dispatch transaction
     * - Check that dispatch was async-dispatched with 2 arrays
     */
    // console.log('PolyToken', PolyToken)
    // // const res = PolyToken.allowance()
    // // console.log('res', res)
    // store = mockStore()
    // store.dispatch(actions.mintTokens())
  })

  test('skips first transaction if previously executed', () => {
    
  })
  
  test.skip('on success shows success message', () => {
    
  })

  test.skip('on failure shows fail message', () => {
    
  })  
})


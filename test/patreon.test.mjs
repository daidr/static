import assert from 'node:assert/strict'
import { test } from 'node:test'

test('Patreon uses API v2 for campaign discovery and paginated members', async (t) => {
  const requests = []
  const member = (id, status, amount, tierAmount = amount) => ({
    data: {
      id,
      type: 'member',
      attributes: {
        patron_status: status,
        currently_entitled_amount_cents: amount,
        pledge_relationship_start: '2026-01-01T00:00:00Z',
      },
      relationships: {
        user: { data: { type: 'user', id } },
        currently_entitled_tiers: { data: [{ type: 'tier', id: `tier-${id}` }] },
      },
    },
    included: [
      {
        id,
        type: 'user',
        attributes: { first_name: id, full_name: id, image_url: `https://example.com/${id}.png`, url: `https://www.patreon.com/${id}` },
      },
      { id: `tier-${id}`, type: 'tier', attributes: { amount_cents: tierAmount } },
    ],
  })

  t.mock.method(globalThis, 'fetch', async (input, options) => {
    const url = new URL(input)
    requests.push(url)
    assert.equal(url.origin, 'https://www.patreon.com')
    assert.equal(new Headers(options.headers).get('authorization'), 'bearer fixture-token')

    let body
    if (url.pathname === '/api/oauth2/v2/campaigns') {
      assert.equal(url.search, '')
      body = { data: [{ id: 'fixture-campaign', type: 'campaign' }] }
    }
    else {
      assert.equal(url.pathname, '/api/oauth2/v2/campaigns/fixture-campaign/members')
      assert.equal(url.searchParams.get('include'), 'user,currently_entitled_tiers')
      assert.ok(url.searchParams.get('fields[member]').includes('currently_entitled_amount_cents'))
      const nextPage = url.searchParams.has('page[cursor]')
      const members = nextPage
        ? [member('former', 'former_patron', 0), member('gifted', 'active_patron', 0, 2000)]
        : [member('active', 'active_patron', 1250), member('free', null, 0)]
      const next = new URL(url)
      next.searchParams.set('page[cursor]', 'next')
      body = {
        data: members.map(m => m.data),
        included: members.flatMap(m => m.included),
        links: { next: nextPage ? null : next.href },
      }
    }
    return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } })
  })

  // Import after mocking: ofetch captures global fetch when it initializes.
  const { ProvidersMap } = await import('sponsorkit')
  const sponsors = await ProvidersMap.patreon.fetchSponsors({ patreon: { token: 'fixture-token' } })
  assert.equal(requests.length, 3)
  assert.equal(requests[2].searchParams.get('page[cursor]'), 'next')
  assert.deepEqual(sponsors.map(s => [s.sponsor.login, s.monthlyDollars]), [
    ['active', 12],
    ['former', -1],
    ['gifted', 20],
  ])
})

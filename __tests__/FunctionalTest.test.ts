import jest from 'jest';

import createTrie, { TrieTree } from '../src';

const trie: TrieTree<any> = createTrie();
const entries = [
    {
        key: 'abcd',
        value: 1,
    },
    {
        key: 'abc',
        value: 2,
    },
    {
        key: 'abdc',
        value: 3,
    },
    {
        key: 'abdce',
        value: 4,
    },
]

describe("Trie", () => {
    it('Should add all given entries', () => {
        trie.addAll(entries);
    });

    it('Should find all values and child values for a given search', () => {
        expect(trie.search('')).toEqual([ 2, 1, 3, 4 ]);
        expect(trie.search('a')).toEqual([ 2, 1, 3, 4 ]);
        expect(trie.search('ab')).toEqual([ 2, 1, 3, 4 ]);
        expect(trie.search('abcd')).toEqual([ 1 ]);
        expect(trie.search('abd')).toEqual([ 3, 4 ]);
        expect(trie.search('abcde')).toEqual([  ]);
    });

    it('Should return the values of only the given search', () => {
        expect(trie.searchExact('abc')).toEqual([ 2 ]);
        expect(trie.searchExact('abcd')).toEqual([ 1 ]);
    });

    it('Should not remove anything if the given key does not have the given value', () => {
        trie.remove('ab', 2);
        expect(trie.search('ab')).toEqual([ 2, 1, 3, 4 ]);
    });
    
    it('Should remove a given value from the given key', () => {
        trie.remove('abc', 2);
        expect(trie.search('ab')).toEqual([ 1, 3, 4 ]);
    });

    it('Should remove all nodes', () => {
        trie.clear();

        expect(trie.search('abc')).toEqual([]);
    });
});

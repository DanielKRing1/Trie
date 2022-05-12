const ROOT_KEY: string = '';

export type TrieNodeChildren<T> = {
    [key: string]: TrieNode<T>;
};
export type TrieNode<T> = {
    key: string;
    values: T[];
    children: TrieNodeChildren<T>;
};

export type TrieTree<T> = {
    add: (key: string, value: T) => number;
    addAll: (all: { key: string, value: T }[]) => void;
    search: (key: string) => T[];
    searchExact: (key: string) => T[];
    remove: (key: string, value: T) => boolean;
    clear: () => void;
}

function _createEmptyTrieNode<T>(key: string): TrieNode<T> {
    return {
        key,
        values: [],
        children: {},
    }
};

export default function createTrie<T>(key: string = ROOT_KEY): TrieTree<T> {
    let root: TrieNode<T> = _createEmptyTrieNode(key);

// PRIVATE API

    const _hasChild = (node: TrieNode<T>, key: string): boolean => {
        return !!node.children[key];
    };
    const _addMissingChild = (node: TrieNode<T>, key: string): void => {
        if(!_hasChild(node, key)) node.children[key] = _createEmptyTrieNode(key);
    };
    const _addValue = (node: TrieNode<T>, value: T): number => {
        return node.values.push(value);
    };

    const _dig = (key: string) => {
        const keys: string[] = key.split('');
        return _digDeeper(root, keys);
    };
    const _digDeeper = (node: TrieNode<T>, keys: string[], pointer: number = 0): TrieNode<T> => {
        // 0. Return current node
        if(pointer >= keys.length) return node;

        const nextKey: string = keys[pointer];

        // 1. Create empty child node, if necessary
        _addMissingChild(node, nextKey);

        // 2. Dig deeper
        const deeperNode: TrieNode<T> = node.children[nextKey];
        return _digDeeper(deeperNode, keys, ++pointer);
    };
    const _getallChildNodes = (root: TrieNode<T>) => {
        let allChildNodes: TrieNode<T>[] = [ root ];

        let pointer = 0;
        while(pointer < allChildNodes.length) {
            const node: TrieNode<T> = allChildNodes[pointer];

            const childNodes: TrieNode<T>[] = Object.values(node.children);
            if(childNodes.length > 0) allChildNodes = allChildNodes.concat(childNodes);

            pointer++;
        }

        return allChildNodes;
    }

// PUBLIC API

    const add = (key: string, value: T): number => {
        const destinationNode: TrieNode<T> = _dig(key);
        return _addValue(destinationNode, value);
    };
    const addAll = (all: { key: string, value: T }[]) => {
        for(let i = 0; i < all.length; i++) {
            const { key, value } = all[i];
            add(key, value);
        }
    };
    const search = (key: string) => {
        const values: T[] = [];

        const destinationNode: TrieNode<T> = _dig(key);
        const allChildNodes: TrieNode<T>[] = _getallChildNodes(destinationNode);

        for(let curNode of allChildNodes) values.push(...curNode.values);

        return values;      
    };
    const searchExact = (key: string) => {
        const destinationNode: TrieNode<T> = _dig(key);
        return destinationNode.values;
    };
    const remove = (key: string, rmVal: T): boolean => {
        // 1. Get node to remove from
        const destinationNode: TrieNode<T> = _dig(key);
        // 2. Get index to remove from node's values
        const indexToRm: number = destinationNode.values.findIndex((curVal: T) => JSON.stringify(curVal) === JSON.stringify(rmVal));

        // 3. Remove if exists
        const wasFound: boolean = indexToRm > -1;
        if(wasFound) destinationNode.values.splice(indexToRm, 1);

        return wasFound;
    };
    const clear = () => {
        root = _createEmptyTrieNode(ROOT_KEY);
    };

    return {
        add,
        addAll,
        search,
        searchExact,
        remove,
        clear,
    };
};
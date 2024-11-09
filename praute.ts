import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const InfiniteScroll = () => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`https://api.example.com/items?page=${page}`);
                setItems(prevItems => [...prevItems, ...response.data.items]);
                if (response.data.items.length === 0) {
                    setHasMore(false);
                }
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        if (hasMore) {
            fetchItems();
        }
    }, [page]);

    const lastItemRef = useRef(node => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    });

    return (
        <div>
            {items.map((item, index) => {
                if (index === items.length - 1) {
                    return <div ref={lastItemRef} key={item.id}>{item.name}</div>;
                } else {
                    return <div key={item.id}>{item.name}</div>;
                }
            })}
            {!hasMore && <p>No more items to load.</p>}
        </div>
    );
};

export default InfiniteScroll;

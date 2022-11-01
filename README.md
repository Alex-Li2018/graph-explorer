# Graph Explorer

MATCH(n:Movie{title:"That Thing You Do"}) - [R:ACTED_IN]-(m) return n,R,m

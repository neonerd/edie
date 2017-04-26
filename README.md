Edie
====

Edie is a convention-over-configuration Koa controllers layer.

Work in progress. Use at your own risk.

Directory structure:

Quickstart:

```
behaviours/
  -- index.get.js
  -- articles/
  ---- index.get.js
  ---- _id/
  ------ index.get.js
```

Resulting api:

```
/
/articles
/articles/{id}
```


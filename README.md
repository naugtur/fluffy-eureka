# fluffy-eureka

## experiments

### fuzzy tree object structure extraction

hack1 takes youtube playlist page, gets contents of script tags, extracts JSON and fuzz-reconstructs flat data from the structure.
```
mkdir samples
curl <youtube playlist page url> > samples/a.html
node hack1.js
```


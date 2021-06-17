/* jshint curly:true, debug:true */
/* globals $, Vue */

// Flickr API key
const APP_ID = '060f5a7e';
const APP_KEY = '8d9c37bcad7f13cba5ad13acf4129734';

// 状態の定数
const IS_INITIALIZED = 'IS_INITIALIZED'; // 最初の状態
const IS_FETCHING = 'IS_FETCHING'; // APIからデータを取得中
const IS_FAILED = 'IS_FAILED'; // APIからデータを取得できなかった
const IS_FOUND = 'IS_FOUND'; // APIから画像データを取得できた
const IS_NOT_FOUND = 'IS_NOT_FOUND';

// 検索テキストに応じたデータを取得するためのURLを作成して返す
const getRequestURL = (searchText) => {
  const parameters = $.param({
    q: searchText,
    app_id: APP_ID,
    app_key: APP_KEY,
    from: 0,
    to: 20,
  });
  const url = `https://api.edamam.com/search?${parameters}`;
  return url;
};

  
new Vue({
  el: '#app',

  data: {
    prevSearchText: '',
    recipes: [],
    currentState: IS_INITIALIZED,
  },

  computed: {
    isInitialized() {
      return this.currentState === IS_INITIALIZED;
    },
    isFetching() {
      return this.currentState === IS_FETCHING;
    },
    isFailed() {
      return this.currentState === IS_FAILED;
    },
    isFound() {
      return this.currentState === IS_FOUND;
    },
    isNotFound(){
      return this.currentState === IS_NOT_FOUND;
    },
    

  },

  methods: {
    toFetching() {
      this.currentState = IS_FETCHING;
    },
    toFailed() {
      this.currentState = IS_FAILED;
    },
    toFound() {
      this.currentState = IS_FOUND;
    },
    toNotFound(){
      this.currentState = IS_NOT_FOUND;
    },

    fetchRecipesFromRecipe(event) {
      
      const searchText = event.target.elements.search.value;

      if (this.isFetching && searchText === this.prevSearchText) {
        return;
      }

      this.prevSearchText = searchText;

      this.toFetching();

      const url = getRequestURL(searchText);
      $.getJSON(url, (data) => {

        const fetchedRecipes = data.hits;
        if (fetchedRecipes.length === 0) {
          this.toNotFound();
          return;           
        }
        
        const arrangedRecipes = [];
        
        for (let i = 0, len = fetchedRecipes.length; i < len; i++) {
          const recipeURL = fetchedRecipes[i].recipe.url;
          const recipeImage = fetchedRecipes[i].recipe.image;
          const recipeLabel = fetchedRecipes[i].recipe.label;
          const recipeCusineType = fetchedRecipes[i].recipe.cuisineType;
          const recipeSource = fetchedRecipes[i].recipe.source;
          const recipeIngredientlist = fetchedRecipes[i].recipe.ingredientLines;
          
          
          const arrangedRecipe = {
            imageURL: recipeImage,
            pageURL: recipeURL,
            label: recipeLabel,
            cuisineType: recipeCusineType,
            source: recipeSource,
            ingredient: recipeIngredientlist,
          };
          
          arrangedRecipes.push(arrangedRecipe);
        }
        
        this.recipes= arrangedRecipes;
        

        this.toFound();
      }).fail(() => {
        this.toFailed();
      });
    },
  },
});


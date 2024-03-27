<template>
  <RouterView />
</template>

<style lang="scss">
html {
  box-sizing: border-box;
  font-family: $font-family;
  font-size: $font-size;
  color: $text-color;
  background-color: $background-color;
}

*, *:before, *:after {
  box-sizing: inherit;
  font-weight: normal;
}

body {
  margin: 0;
  padding: 0;
}

h1 {
  font-size: 19px;
  font-weight: bold;
}

h2 {
  font-size: 17px;
  font-weight: bold;
}

a {
  text-decoration: none;
  color: $accent-color;

  &:hover {
    text-decoration: underline;
  }
}

ul {
  padding-left: 1rem;
  padding-right: 1rem;
  margin: 0;
}

table {
  border-collapse: collapse;
  padding-left: $gutter;
  width: 100%;

  tr {
    height: 2rem;
    border-top: 1px solid darken($card-background-color, 10%);
    border-bottom: 1px solid darken($card-background-color, 10%);
  }

  td {
    &:first-child {
      padding-left: $gutter;
    }

    padding-right: $gutter;
  }
}
</style>

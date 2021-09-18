# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Release Notes for SCAP RETAIL


## 13 Desember 2020
### POS-RETAIL V.0.1.3 #1 

### Changed
1. Pemisahan repository dari project Backoffice(standalone)


## 10 Desember 2020
### POS-RETAIL V.0.1.2 #1 
### Install Dependencies
1. cross-env [link](https://www.npmjs.com/package/cross-env)

### Changed
1. Column Table Sales Price (purchPrice => salesPrice)
2. Refactoring (splitting) File  `Kasir (children)`  dan `Hotkeys (parent)`

### Removed
1. Search by item Name using `react-async-AsyncPaginate`
2. Button Pembayaran

### Added
1. Keyboard event back to `cari item`(s atau keyCode = 83) 
2. Keyboard event enter untuk `pindah inputan berikutnya` ( keyCode = 13)
   (`modal Pembayaran dan modal diskon`)
3. Info Keyboard untuk user
4. config IP dynamically for production 
  [reference](https://stackoverflow.com/questions/51747628/js-serving-and-rest-api-from-machine-with-changing-ip-address/51747940)
  ```
  build cross-env API_URL=http://localhost:8000 NODE_ENV=production webpack --config     build/webpack.config.js
  ```

## 09 Desember 2020

### POS-RETAIL V0.1.1 #1
### Added
1. Keyboard event utk pembayaran (f9), save (f10) => react-hotkeys
2. User Access by Outlet saat masuk POS
3. Integrasi API POS

### Fixed
1. fix bug pada metode pembayaran (tidak bisa settleCode yang sama)

### Install Dependencies
1. react-autosuggest V10.0.4 [link](https://www.npmjs.com/package/react-autosuggest)
2. react-hotkeys v2.0.0 [link](https://github.com/greena13/react-hotkeys)

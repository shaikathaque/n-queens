// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

     */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var rows = this.rows();
      var row = rows[rowIndex];
      var pieceCount = row.reduce(function(a, b) {return a + b; });

      return pieceCount > 1;

    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      //get reference to all the rows
      //execute hasRowConflictAt() on each row
      //at each iteration, if the function returns true, return true. otherwise do nothing
      //if true not returned at the end of iterations, return false
      var rows = this.rows();

      for (var i = 0; i < rows.length; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var rows = this.rows();

      var colPieceCount = 0;
      for (var i = 0; i < rows.length; i++) {
        colPieceCount += rows[i][colIndex];
      }

      return colPieceCount > 1; // fixme
    },

    // colIndex = 0

    // [
    //   [1,0,0],
    //   [1,0,0],
    //   [0,0,0]
    // ]

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var rows = this.rows();

      for (var i = 0; i < rows.length; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict

    //start a loop starting with starting square
    //check value at next square (next row index and next column)
    //if value is 1/not null/not undefined
    //add it to diagonalPieceCount
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var rows = this.rows();

      var columnIndex = majorDiagonalColumnIndexAtFirstRow;

      if (columnIndex >= 0) {
        var startingSquare = rows[0][columnIndex];
        var diagPieceCount = startingSquare;

        for (var i = 1; i < rows.length; i++) {
          if (rows[i] && rows[i][columnIndex + i]) {
            var nextSquare = rows[i][columnIndex + i];
            diagPieceCount += nextSquare;
          }
        }
      }

      if (columnIndex < 0) {
        var startingRow = Math.abs(columnIndex);
        var startingCol = 0;

        var startingSquare = rows[startingRow][startingCol];
        var diagPieceCount = startingSquare;

        for (var i=1; i<rows.length; i++) {
          if(rows[startingRow + i] && rows[startingRow + i][startingCol + i]) {
            var nextSquare = rows[startingRow + i][startingCol + i];
            diagPieceCount += nextSquare;
          }
        }
      }
      return diagPieceCount > 1;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var rows = this.rows();
      var startingIndex = (rows.length * -1) + 1;

      for (var i=startingIndex; i<rows.length; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {


      var rows = this.rows();

      var columnIndex = minorDiagonalColumnIndexAtFirstRow;

      // case where we are given a column index that starts at row 0
      if (columnIndex <= rows.length - 1) {
        var startingSquare = rows[0][columnIndex];
        var diagPieceCount = startingSquare;

        for (var i = 1; i < rows.length; i++) {
          // rows increases and column decreases
          if (rows[i] && rows[i][columnIndex - i]) {
            var nextSquare = rows[i][columnIndex - i];
            diagPieceCount += nextSquare;
          }
        }
      }

      //case where we have to find the row index that starts at col 0
      if (columnIndex > rows.length - 1) {
        // adjust starting row according to pattern we found
        var startingRow = columnIndex - (rows.length - 1);
        // startingCol is the last col
        var startingCol = rows.length - 1;

        var startingSquare = rows[startingRow][startingCol];
        var diagPieceCount = startingSquare;

        for (var i=1; i<rows.length; i++) {
          // row increases and col decreases
          if(rows[startingRow + i] && rows[startingRow + i][startingCol - i]) {
            var nextSquare = rows[startingRow + i][startingCol - i];
            diagPieceCount += nextSquare;
          }
        }
      }

      return diagPieceCount > 1;
      //return false; // fixme

    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var rows = this.rows();
      var startingIndex = (rows.length * 2) - 2;

      // decrement instead of increment
      for (var i=startingIndex; i>0; i--) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());

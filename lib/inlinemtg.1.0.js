/*!

    Inline Magic: The Gathering Tooltips v1.0
    
    for use with Simple Inline Tooltips v1.0
    http://www.infinitegyre.com/2014/03/simple-inline-tooltips.html

    Copyright (c) 2014 Nickolas Reynolds
    Released under the MIT license

*/

/*

    DESCRIPTION

        Specify the name of a Magic card, and this script will attach a
        tooltip with the card's image, and link to the card's Gatherer page.

    HOW TO USE

        <span class="inlinemtg">Lightning Bolt</span>

    DEPENDENCIES

        jQuery 1.7 or later
        Simple Inline Tooltips v1.0

    ADVANCED OPTIONS

    * Custom link text:

    <span class="inlinemtg" data-name="Lightning Bolt">Custom link text</span>

    * Version from a particular set:

    <span class="inlinemtg" data-set="Alpha">Lightning Bolt</span>

        Note: There is a fairly extensive data table that attempts to
              map whatever you specify in data-set to a Gatherer set
              code. Most normal ways you can think of to refer to a
              set name are probably in the data table and will work,
              e.g. "ftv20", "revised", "sixth", "scars", "masques" ...

        Note: This only changes the picture in the tooltip. The link will
              still lead to whatever the latest version of the card is.
              This is due to a limitation in Gatherer, so there's no easy
              way to fix it.

    * Link by multiverse id:

    <span class="inlinemtg" data-multiverseid="225652">Italian Lightning Bolt</span>

    * Rotate a split card:

    <span class="inlinemtg" data-options="rotate90">Fire // Ice</span>

        Note: Split cards are problematic. Gatherer's image handler will
              accept search strings like "Fire // Ice", but the search
              handler (where the link goes) chokes on it. The only way
              to *link* to a split card is to specify its multiverse id,
              for example:

    <span class"inlinemtg" data-multiverseid="292753">Fire and Ice, a great card</span>

    You may chain any and all of the advanced options together, though
    multiverse id will override name and set.

*/

$( document ).ready( function() {

    inlinemtg.linkcards( $( document ) );

} );

var inlinemtg = {

    linkcards: function ( scope ) {

        // Within the given scope, select all elements with css class
        // "inlinemtg" (and not "inlinemtgprocessed"):

        var cards = scope.find( ".inlinemtg" ).not( ".inlinemtgprocessed" );
		
        // For each of those elements ...

        cards.each( function( index, element ) {

            // Parse all of the user specified data:

            var options = $( element ).data( "options" );           // data-options
            var name = $( element ).data( "name" );                 // data-name
            var set = $( element ).data( "set" );                   // data-set
            var multiverseid = $( element ).data( "multiverseid" ); // data-multiverseid
            var contents = $( element ).html();                     // Span contents (link text)
            var a_params = "";
			
            // If no multiverseid is specified ...

            if( typeof multiverseid == "undefined" ) {

                // ... set name = contents, or contents = name, if either
                // is missing:

                if( typeof name == "undefined" ) name = contents;
                if( contents == "" ) contents = name;

                // Start building the parameter string that will be given
                // to the Gatherer image handler and search handler:

                a_params += "&name=" + name;

                // If a set is specified ...

                if( typeof set != "undefined" ) {

                    // ... strip punctuation, spaces, convert to upper-case:

                    var strip = set.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`'~()\s]/g,"")
                                   .toUpperCase();

                    // If the stripped string is in inlinemtg.sets, then use
                    // the corresponding set code:

                    if( strip in inlinemtg.sets ) set = inlinemtg.sets[ strip ];

                    // Otherwise just use whatever was specified, and continue
                    // building the parameter string:

                    a_params += "&set=" + set;

                }

            // If multiverseid *is* specified:
				
            } else {

                // Build the parameter string accordingly, and set
                // contents = multiverseid if contents is missing:

                a_params += "&multiverseid=" + multiverseid;
                if( contents == "" ) contents = multiverseid;

            }

            // Make a parameter string for the image handler, and if options
            // are specified, tack them onto the image parameters:

            var img_params = a_params;
            if( typeof options != undefined ) img_params += "&options=" + options;

            // Put everything together and overwrite the span contents
            // (link text), resulting in the following structure:
            //
            // <span class="inlinemtg">
            //     <a href="...">Previous Contents</a>
            //     <span class="iltt"><a href="..."><img src="..."></a></span>
            // </span>

            var a_start = '<a href="http://gatherer.wizards.com/Pages/Card/Details.aspx?type=card';
            var a_end = '" target="_blank">';
            var img_start = '<img src="http://gatherer.wizards.com/Handlers/Image.ashx?type=card';

            var htmlstring = [ a_start + a_params + a_end + contents + '</a><span class="iltt">',
                               a_start + a_params + a_end + img_start + img_params + '"></a></span>'
                             ].join( "" );

            $( element ).html( htmlstring );

            // Add a css class to the indicate that the inlinemtg span has been
            // processed. This prevents the script from trying to reprocess it
            // if inlinemtg.linkcards is called again for whatever reason.

            $( element ).addClass( "inlinemtgprocessed" );

            // Tell inlinetooltip.js to initialize the element, since it now
            // has an uninitialized tooltip inside of it:

            iltt.initialize( $( element ) );

        } );

    },

    // Data table with common ways of referring to all of the extant Magic
    // card sets as of 2014-03-01, mapped to the corresponding Gatherer set
    // code.
    //
    // Note: data-set is stripped and sanitized before the lookup, so, for
    //       example, data-set="Urza's Saga" will be converted to URZASSAGA
    //       and then correctly identified with Gatherer set code "UZ".
    
    sets: { "10": "10E",
            "10E": "10E",
            "10TH": "10E",
            "10THEDITION": "10E",
            "CORESETTENTHEDITION": "10E",
            "TEN": "10E",
            "TENTH": "10E",
            "TENTHEDITION": "10E",
            "1": "1E",
            "1ST": "1E",
            "1STEDITION": "1E",
            "ALPHA": "1E",
            "FIRST": "1E",
            "FIRSTEDITION": "1E",
            "LEA": "1E",
            "LIMITEDEDITIONALPHA": "1E",
            "ONE": "1E",
            "2": "2E",
            "2ND": "2E",
            "2NDEDITION": "2E",
            "BETA": "2E",
            "LEB": "2E",
            "LIMITEDEDITIONBETA": "2E",
            "SECOND": "2E",
            "SECONDEDITION": "2E",
            "TWO": "2E",
            "2ED": "2U",
            "UNLIMITED": "2U",
            "3ED": "3E",
            "REV": "3E",
            "REVISED": "3E",
            "REVISEDEDITION": "3E",
            "THIRD": "3E",
            "THIRDEDITION": "3E",
            "4": "4E",
            "4ED": "4E",
            "4TH": "4E",
            "4THEDITION": "4E",
            "FOUR": "4E",
            "FOURTH": "4E",
            "FOURTHEDITION": "4E",
            "5DN": "5DN",
            "FIFTHDAWN": "5DN",
            "5": "5E",
            "5ED": "5E",
            "5TH": "5E",
            "5THEDITION": "5E",
            "FIFTH": "5E",
            "FIFTHEDITION": "5E",
            "FIVE": "5E",
            "6": "6E",
            "6ED": "6E",
            "6TH": "6E",
            "6THEDITION": "6E",
            "CLASSICSIXTHEDITION": "6E",
            "SIX": "6E",
            "SIXTH": "6E",
            "SIXTHEDITION": "6E",
            "7": "7E",
            "7ED": "7E",
            "7TH": "7E",
            "7THEDITION": "7E",
            "SEVEN": "7E",
            "SEVENTH": "7E",
            "SEVENTHEDITION": "7E",
            "8": "8ED",
            "8ED": "8ED",
            "8TH": "8ED",
            "8THEDITION": "8ED",
            "CORESETEIGHTHEDITION": "8ED",
            "EIGHT": "8ED",
            "EIGHTH": "8ED",
            "EIGHTHEDITION": "8ED",
            "9": "9ED",
            "9ED": "9ED",
            "9TH": "9ED",
            "9THEDITION": "9ED",
            "CORESETNINTHEDITION": "9ED",
            "NINE": "9ED",
            "NINTH": "9ED",
            "NINTHEDITION": "9ED",
            "ALL": "AL",
            "ALLIANCES": "AL",
            "ALA": "ALA",
            "ALARA": "ALA",
            "SHARDS": "ALA",
            "SHARDSOFALARA": "ALA",
            "ARABIANNIGHTS": "AN",
            "ARN": "AN",
            "APC": "AP",
            "APOCALYPSE": "AP",
            "ANTIQ": "AQ",
            "ANTIQUITIES": "AQ",
            "ATQ": "AQ",
            "ALARAREBORN": "ARB",
            "ARB": "ARB",
            "REBORN": "ARB",
            "ARC": "ARC",
            "ARCHENEMY": "ARC",
            "ARE": "ARE",
            "ARENA": "ARE",
            "ANTHOLOGIES": "ATH",
            "ATH": "ATH",
            "BEATDOWN": "BD",
            "BTD": "BD",
            "BIN": "BIN",
            "BOOKINSERTS": "BIN",
            "BNG": "BNG",
            "BORNOFTHEGODS": "BNG",
            "BETRAYERS": "BOK",
            "BETRAYERSOFKAMIGAWA": "BOK",
            "BOK": "BOK",
            "BATTLEROYALE": "BR",
            "BRB": "BR",
            "C13": "C13",
            "COMMANDER2013EDITION": "C13",
            "COMMANDER2013": "C13",
            "CFX": "CFX",
            "CONFLUX": "CFX",
            "DESTINY": "CG",
            "UDS": "CG",
            "URZASDESTINY": "CG",
            "CHR": "CH",
            "CHRONICLES": "CH",
            "CHAMPIONS": "CHK",
            "CHAMPIONSOFKAMIGAWA": "CHK",
            "CHK": "CHK",
            "CHAMPSPROMOS": "CHP",
            "CHP": "CHP",
            "CIN": "CIN",
            "COMICINSERTS": "CIN",
            "CM1": "CM1",
            "COMMANDERSARSENAL": "CM1",
            "CMD": "CMD",
            "COMMANDER": "CMD",
            "CNS": "CNS",
            "CONSPIRACY": "CNS",
            "COLDSNAP": "CSP",
            "CSP": "CSP",
            "COLDSNAPTHEMEDECKS": "CST",
            "CST": "CST",
            "CONVENTIONPROMOS": "CVP",
            "CVP": "CVP",
            "DD2": "DD2",
            "DUELDECKSJACEVSCHANDRA": "DD2",
            "DUELDECKJACEVSCHANDRA": "DD3",
            "JACEVSCHANDRA": "DD4",
            "DDC": "DDC",
            "DIVINEVSDEMONIC": "DDC",
            "DUELDECKDIVINEVSDEMONIC": "DDC",
            "DUELDECKSDIVINEVSDEMONIC": "DDC",
            "DDD": "DDD",
            "DUELDECKGARRUKVSLILIANA": "DDD",
            "DUELDECKSGARRUKVSLILIANA": "DDD",
            "GARRUKVSLILIANA": "DDD",
            "DDE": "DDE",
            "DUELDECKPHYREXIAVSTHECOALITION": "DDE",
            "DUELDECKSPHYREXIAVSTHECOALITION": "DDE",
            "PHYREXIAVSTHECOALITION": "DDE",
            "DDF": "DDF",
            "DUELDECKELSPETHVSTEZZERET": "DDF",
            "DUELDECKSELSPETHVSTEZZERET": "DDF",
            "ELSPETHVSTEZZERET": "DDF",
            "DDG": "DDG",
            "DUELDECKKNIGHTSVSDRAGONS": "DDG",
            "DUELDECKSKNIGHTSVSDRAGONS": "DDG",
            "KNIGHTSVSDRAGONS": "DDG",
            "AJANIVSNICOLBOLAS": "DDH",
            "DDH": "DDH",
            "DUELDECKAJANIVSNICOLBOLAS": "DDH",
            "DUELDECKSAJANIVSNICOLBOLAS": "DDH",
            "DDI": "DDI",
            "DUELDECKVENSERVSKOTH": "DDI",
            "DUELDECKSVENSERVSKOTH": "DDI",
            "VENSERVSKOTH": "DDI",
            "DDJ": "DDJ",
            "DUELDECKIZZETVSGOLGARI": "DDJ",
            "DUELDECKSIZZETVSGOLGARI": "DDJ",
            "IZZETVSGOLGARI": "DDJ",
            "DDK": "DDK",
            "DUELDECKSORINVSTIBALT": "DDK",
            "DUELDECKSSORINVSTIBALT": "DDK",
            "SORINVSTIBALT": "DDK",
            "DDL": "DDL",
            "DUELDECKHEROESVSMONSTERS": "DDL",
            "DUELDECKSHEROESVSMONSTERS": "DDL",
            "HEROESVSMONSTERS": "DDL",
            "DDM": "DDM",
            "DUELDECKJACEVSVRASKA": "DDM",
            "DUELDECKSJACEVSVRASKA": "DDM",
            "JACEVSVRASKA": "DDM",
            "DGM": "DGM",
            "DRAGONSMAZE": "DGM",
            "DIS": "DIS",
            "DISSENSION": "DIS",
            "DARK": "DK",
            "DRK": "DK",
            "THEDARK": "DK",
            "DARKASCENSION": "DKA",
            "DKA": "DKA",
            "DECKMASTERSGARFIELDVSFINKEL": "DKM",
            "DKM": "DKM",
            "GARFIELDVSFINKEL": "DKM",
            "DCILEGENDMEMBERSHIP": "DLM",
            "DLM": "DLM",
            "DPA": "DPA",
            "DUELOFTHEPLANESWALKERS": "DPA",
            "DUELSOFTHEPLANESWALKERS": "DPA",
            "DUELSOFTHEPLANESWALKERSDECKS": "DPA",
            "DRAGONS": "DRB",
            "DRB": "DRB",
            "FROMTHEVAULTDRAGONS": "DRB",
            "FTVDRAGONS": "DRB",
            "DARKSTEEL": "DST",
            "DST": "DST",
            "EVE": "EVE",
            "EVENTIDE": "EVE",
            "DUELDECKELVESVSGOBLINS": "EVG",
            "DUELDECKSELVESVSGOBLINS": "EVG",
            "ELVESVSGOBLINS": "EVG",
            "EVG": "EVG",
            "EXO": "EX",
            "EXODUS": "EX",
            "FBP": "FBP",
            "FULLBOXPROMOTION": "FBP",
            "FALLENEMPIRES": "FE",
            "FEM": "FE",
            "FNM": "FNM",
            "FNMPROMO": "FNM",
            "FST": "FUT",
            "FUT": "FUT",
            "FUTURESIGHT": "FUT",
            "GAM": "GAM",
            "VIDEOGAMEPROMOS": "GAM",
            "GPT": "GPT",
            "GUILDPACT": "GPT",
            "GPX": "GPX",
            "GRANDPRIXPROMOS": "GPX",
            "GATECRASH": "GTC",
            "GTC": "GTC",
            "GATEWAY": "GTW",
            "GATEWAYANDWPNPROMOS": "GTW",
            "GATEWAYWPNPROMOS": "GTW",
            "GTW": "GTW",
            "LEGACY": "GU",
            "ULG": "GU",
            "URZASLEGACY": "GU",
            "H09": "H09",
            "PREMIUMDECKSERIESSLIVERS": "H09",
            "SLIVERS": "H09",
            "HAPPYHOLIDAYPROMOS": "HHL",
            "HHL": "HHL",
            "HML": "HM",
            "HOMELAND": "HM",
            "HOMELANDS": "HM",
            "HOP": "HOP",
            "PLANECHASE": "HOP",
            "I2P": "I2P",
            "INTRODUCTORYTWOPLAYER": "I2P",
            "ICE": "IA",
            "ICEAGE": "IA",
            "ICEAGES": "IA",
            "INV": "IN",
            "INVASION": "IN",
            "INNISTRAD": "ISD",
            "ISD": "ISD",
            "JGC": "JGC",
            "JUDGEGIFTCARDS": "JGC",
            "JOU": "JOU",
            "JOURNEYINTONYX": "JOU",
            "NYX": "JOU",
            "JUD": "JUD",
            "JUDGMENT": "JUD",
            "JUN": "JUN",
            "JUNIORSERIESPROMOS": "JUN",
            "LEG": "LE",
            "LEGEND": "LE",
            "LEGENDS": "LE",
            "LEGION": "LGN",
            "LEGIONS": "LGN",
            "LGN": "LGN",
            "ALTERNATEARTLANDS": "LND",
            "LND": "LND",
            "LORWYN": "LRW",
            "LRW": "LRW",
            "2010": "M10",
            "M10": "M10",
            "M2010": "M10",
            "MAGIC2010": "M10",
            "2011": "M11",
            "M11": "M11",
            "M2011": "M11",
            "MAGIC2011": "M11",
            "2012": "M12",
            "M12": "M12",
            "M2012": "M12",
            "MAGIC2012": "M12",
            "2013": "M13",
            "M13": "M13",
            "M2013": "M13",
            "MAGIC2013": "M13",
            "2014": "M14",
            "M14": "M14",
            "M2014": "M14",
            "MAGIC2014": "M14",
            "2015": "M15",
            "M15": "M15",
            "M2015": "M15",
            "MAGIC2015": "M15",
            "BESIEGED": "MBS",
            "MBS": "MBS",
            "MIRRODINBESIEGED": "MBS",
            "MAGICGAMEDAY": "MGD",
            "MGD": "MGD",
            "MIR": "MI",
            "MIRAGE": "MI",
            "MAGAZINEINSERTS": "MIN",
            "MIN": "MIN",
            "MASQUE": "MM",
            "MASQUES": "MM",
            "MERCADIANMASQUE": "MM",
            "MERCADIANMASQUES": "MM",
            "MMQ": "MM",
            "MMA": "MMA",
            "MODERNMASTERS": "MMA",
            "MOR": "MOR",
            "MORNINGTIDE": "MOR",
            "MAGICPLAYREWARDS": "MPR",
            "MPR": "MPR",
            "MIRRODIN": "MRD",
            "MRD": "MRD",
            "NEMESIS": "NE",
            "NMS": "NE",
            "NEWPHYREXIA": "NPH",
            "NPH": "NPH",
            "ODY": "OD",
            "ODYSSEY": "OD",
            "ONS": "ONS",
            "ONSLAUGHT": "ONS",
            "P02": "P2",
            "PORTAL2": "P2",
            "PORTALSECONDAGE": "P2",
            "PORTALTWO": "P2",
            "SECONDAGE": "P2",
            "1999": "P3",
            "S99": "P3",
            "STARTER1999": "P3",
            "STARTER99": "P3",
            "2000": "P4",
            "S00": "P4",
            "STARTER00": "P4",
            "STARTER2000": "P4",
            "PC2": "PC2",
            "PLANECHASE2012EDITION": "PC2",
            "PLANECHASE2012": "PC2",
            "FIRELIGHTNING": "PD2",
            "FIREANDLIGHTNING": "PD2",
            "PD2": "PD2",
            "PREMIUMDECKSERIESFIRELIGHTNING": "PD2",
            "PREMIUMDECKSERIESFIREANDLIGHTNING": "PD2",
            "GRAVEBORN": "PD3",
            "PD3": "PD3",
            "PREMIUMDECKSERIESGRAVEBORN": "PD3",
            "PORTAL3": "PK",
            "PORTALTHREE": "PK",
            "PORTALTHREEKINGDOMS": "PK",
            "PTK": "PK",
            "THREEKINGDOMS": "PK",
            "PLANARCHAOS": "PLC",
            "PLC": "PLC",
            "POR": "PO",
            "PORTAL": "PO",
            "PORTAL1": "PO",
            "PORTALONE": "PO",
            "PCY": "PR",
            "PROPHECY": "PR",
            "PRE": "PRE",
            "PRERELEASEPROMOS": "PRE",
            "PLANESHIFT": "PS",
            "PLS": "PS",
            "PROTOURPROMOS": "PTR",
            "PTR": "PTR",
            "RAV": "RAV",
            "RAVNICA": "RAV",
            "RAVNICACITYOFGUILDS": "RAV",
            "REL": "REL",
            "RELEASE&LAUNCHPARTIES": "REL",
            "ELDRAZI": "ROE",
            "RISE": "ROE",
            "RISEOFTHEELDRAZI": "ROE",
            "ROE": "ROE",
            "RETURNTORAVNICA": "RTR",
            "RTR": "RTR",
            "SCG": "SCG",
            "SCOURGE": "SCG",
            "SHADOWMOOR": "SHM",
            "SHADOWMORE": "SHM",
            "SHM": "SHM",
            "SAVIORS": "SOK",
            "SAVIORSOFKAMIGAWA": "SOK",
            "SOK": "SOK",
            "SCARS": "SOM",
            "SCARSOFMIRRODIN": "SOM",
            "SOM": "SOM",
            "STH": "ST",
            "STRONGHOLD": "ST",
            "STO": "STO",
            "STOREPROMOS": "STO",
            "SUM": "SUM",
            "SUMMEROFMAGICPROMOS": "SUM",
            "TEMPEST": "TE",
            "TMP": "TE",
            "THG": "THG",
            "TWOHEADEDGIANTPROMOS": "THG",
            "THEROS": "THS",
            "THS": "THS",
            "TOR": "TOR",
            "TORMENT": "TOR",
            "TIMESHIFTED": "TSB",
            "TSB": "TSB",
            "TIMESPIRAL": "TSP",
            "TSP": "TSP",
            "UGL": "UG",
            "UNGLUED": "UG",
            "UNH": "UNH",
            "UNHINGED": "UNH",
            "ULTRARARECARDS": "URC",
            "URC": "URC",
            "SAGA": "UZ",
            "URZASSAGA": "UZ",
            "USG": "UZ",
            "FROMTHEVAULTEXILED": "V09",
            "V09": "V09",
            "FTVEXILED": "V09",
            "EXILED": "V09",
            "FROMTHEVAULTRELICS": "V10",
            "V10": "V10",
            "FTVRELICS": "V10",
            "RELICS": "V10",
            "FROMTHEVAULTLEGENDS": "V11",
            "V11": "V11",
            "FTVLEGENDS": "V11",
            "FROMTHEVAULTREALMS": "V12",
            "FTVREALMS": "V12",
            "REALMS": "V12",
            "V12": "V12",
            "20": "V13",
            "FROMTHEVAULTTWENTY": "V13",
            "FTV20": "V13",
            "FTVTWENTY": "V13",
            "TWENTY": "V13",
            "V13": "V13",
            "ANNIHILATION": "V14",
            "FROMTHEVAULTANNIHILATION": "V14",
            "FTVANNIHILATION": "V14",
            "V14": "V14",
            "VIS": "VI",
            "VISIONS": "VI",
            "WEATHERLIGHT": "WL",
            "WTH": "WL",
            "CHAMPIONSHIPPRIZES": "WLD",
            "WLD": "WLD",
            "WORLDWAKE": "WWK",
            "WWK": "WWK",
            "ZEN": "ZEN",
            "ZENDIKAR": "ZEN"
    }

};
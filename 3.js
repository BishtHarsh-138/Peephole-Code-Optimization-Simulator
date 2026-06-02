document.getElementById("optimizeBtn").onclick = function () {

    let input = document.getElementById("inputCode").value.split("\n");

    let output = [];
    let rules = [];

    // Symbol Table Object
    let symbolTable = {};

    // Keywords to ignore
    let keywords = [
        "int", "float", "double", "char",
        "return", "if", "else", "for",
        "while", "do", "switch", "case",
        "break", "continue", "void",
        "main", "include", "using",
        "namespace", "std"
    ];

    for (let i = 0; i < input.length; i++) {

        let originalLine = input[i];
        let line = originalLine.trim();

        // ------------------------
        // SYMBOL TABLE GENERATION
        // ------------------------

        let identifiers = line.match(/[a-zA-Z_][a-zA-Z0-9_]*/g);

        if (identifiers) {

            identifiers.forEach(id => {

                if (!keywords.includes(id)) {

                    if (!symbolTable[id]) {
                        symbolTable[id] = 0;
                    }

                    symbolTable[id]++;
                }
            });
        }

        // ------------------------
        // OPTIMIZATION
        // ------------------------

        if (line === "") {
            output.push("");
            continue;
        }

        let cleanLine = line.replace(/\s+/g, "");

        let parts = cleanLine.split("=");

        if (parts.length === 2) {

            let left = parts[0];
            let right = parts[1].replace(";", "");

            // x=x;
            if (left === right) {

                rules.push(
                    "Removed self assignment: " + originalLine
                );

                continue;
            }

            // x=x+0;
            if (right === left + "+0") {

                rules.push(
                    "Simplified addition by zero: " + originalLine
                );

                output.push(left + ";");

                continue;
            }

            // x=x*1;
            if (right === left + "*1") {

                rules.push(
                    "Simplified multiplication by one: " + originalLine
                );

                output.push(left + ";");

                continue;
            }

            // x=x*2;
            if (right === left + "*2") {

                rules.push(
                    "Strength reduction: " + originalLine
                );

                output.push(
                    left + " = " + left + " << 1;"
                );

                continue;
            }

            // x=x/1;
            if (right === left + "/1") {

                rules.push(
                    "Removed division by one: " + originalLine
                );

                output.push(left + ";");

                continue;
            }

            // x=x-0;
            if (right === left + "-0") {

                rules.push(
                    "Simplified subtraction by zero: " + originalLine
                );

                output.push(left + ";");

                continue;
            }
        }

        output.push(originalLine);
    }

    // Output Code

    document.getElementById("outputCode").value =
        output.join("\n");

    // Rules

    if (rules.length > 0) {

        document.getElementById("rulesBox").innerHTML =
            rules.join("<br>");

    } else {

        document.getElementById("rulesBox").innerHTML =
            "No optimization applied";
    }

    // Counter

    document.getElementById("count").innerText =
        rules.length;

    // Symbol Table

    let tableBody =
        document.getElementById("symbolTableBody");

    tableBody.innerHTML = "";

    for (let variable in symbolTable) {

        let row = `
            <tr>
                <td>${variable}</td>
                <td>${symbolTable[variable]}</td>
            </tr>
        `;

        tableBody.innerHTML += row;
    }
};


document.getElementById("clearBtn").onclick = function () {

    document.getElementById("inputCode").value = "";
    document.getElementById("outputCode").value = "";
    document.getElementById("rulesBox").innerHTML = "";

    document.getElementById("count").innerText = 0;

    document.getElementById("symbolTableBody").innerHTML = "";
};
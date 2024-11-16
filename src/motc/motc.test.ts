import { MOTC } from ".";

describe("motc-tests", () => {
    it("parse", () => {
        const sample = 
`#name Sample Map
#description This is a sample description!
#author NriotHrreion

@objects {
    ball {
        id: ball1
        name: m
        mass: 5
    }

    block {
        id: block1
        name: M
        mass: 10
    }
}

@when {
    3s {
        delete ball1
        delete block1
    }
}`;
        const expectedResult = {
            metadata: {
                name: "Sample Map",
                description: "This is a sample description!",
                author: "NriotHrreion"
            },
            chunks: [
                {
                    name: "objects",
                    members: [
                        {
                            name: "ball",
                            properties: [
                                { key: "id", value: "ball1" },
                                { key: "name", value: "m" },
                                { key: "mass", value: 5 }
                            ]
                        },
                        {
                            name: "block",
                            properties: [
                                { key: "id", value: "block1" },
                                { key: "name", value: "M" },
                                { key: "mass", value: 10 }
                            ]
                        }
                    ]
                },
                {
                    name: "when",
                    members: [
                        {
                            time: "3s",
                            statements: [
                                { verb: "delete", args: ["ball1"] },
                                { verb: "delete", args: ["block1"] }
                            ]
                        }
                    ]
                }
            ]
        };
        expect(MOTC.parse(sample)).toStrictEqual(expectedResult);
    });
});
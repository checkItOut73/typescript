type SubType<Type, Condition> = Pick<
    Type,
    {
        [key in keyof Type]: Type[key] extends Condition ? key : never;
    }[keyof Type]
>;

declare type Mock<Type> = {
    [key in keyof SubType<Type, Function>]?: Type[key] & {
        mockReturnValue?: (returnValue: ReturnType<Type[key]>) => void;
        mockImplementation?: (implementation: Type[key]) => void;
        mock?: {
            calls: Array<Parameters<Type[key]>>;
        };
    };
} & {
    [key in keyof SubType<Type, Exclude<any, Function>>]: Type[key];
};

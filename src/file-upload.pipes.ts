import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'byteToMega' })
export class ByteToMega implements PipeTransform {
    transform(value: string): string {
        let bytes = (+value);
        if(bytes === 0)
            return "0 Mb";
        
        let mega = bytes / 1048576;

        return mega.toFixed(2) + " Mb";
    }
}

@Pipe({ name: 'byteToKilo' })
export class ByteToKilo implements PipeTransform {
    transform(value: string): string {
        let bytes = (+value);
        if(bytes === 0)
            return "0 Kb";
        
        let kilo = bytes / 1024;

        return kilo.toFixed(2) + " Kb";
    }
}

@Pipe({ name: 'byteFormat' })
export class ByteFormat implements PipeTransform {
    transform(value: string, format: string = 'auto'): string {
        if(format == "mb")
            return new ByteToMega().transform(value);

        if(format == "kb")
            return new ByteToKilo().transform(value);

        let bytes = (+value);
        if(bytes === 0)
            return "0 bytes";
        
        if(bytes < 1024)
            return bytes + " bytes";
            
        let all = bytes / 1024;

        if(all < 1024)
            return all.toFixed(2) + " Kb";

        all = all / 1024;
        if(all < 1024)
            return all.toFixed(2) + " Mb";      

        all = all / 1024;
        if(all < 1024)
            return all.toFixed(2) + " Gb";     

        all = all / 1024;
        if(all < 1024)
            return all.toFixed(2) + " Tb";                                    

        return value;
    }
}
<%Function FormatPrice(price)
If Len(price) < 7 then
str1 = price
str2 = ","
If InStr(str1,str2) > 0 Then
	price= Replace(str1, ",", "")
End If

str1 = price
str2 = "$"
If InStr(str1,str2) > 0 Then
	price= Replace(str1, "$", "")
End If

     pricelen=len(price)
     if pricelen>3 then
        price=left(price, pricelen-3) &  "," &  right(price, 3)
     end if
     FormatPrice="$" & price   

Else
   FormatPrice= price   
End if
End Function%>

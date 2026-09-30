<%
str1 = Ancestorname
str2 = "''"
If InStr(str1,str2) > 0 Then
Ancestorname= Replace(str1,  str2, "'")
End If 
str1 = trim(AncestorColor)
str2 = "Not Available"
If InStr(str1,str2) > 0 Then
AncestorColor= Replace(str1,  str2, "")
End If 

 if Gender = "Male" then %>
<table border=0 width="160" class = 'AncetryMale'>
<% else %>
<table border=0 width="160"  class = 'AncetryFemale'>
<% end if %>
<tr><td  class = "small" align = "left"><% if len(Ancestorname) > 1 then %><%=Ancestorname%>&nbsp;<% End If %><br>
<%=AncestorColor%>&nbsp;<br>
</td></tr></table>
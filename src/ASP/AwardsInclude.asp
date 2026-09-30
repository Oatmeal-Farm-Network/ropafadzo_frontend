
<% even = true
sql3= "select * from Awards where Awards.ID = " & ID & " order by Placing desc"
Set rs3 = Server.CreateObject("ADODB.Recordset")
'response.write(sql3)
rs3.Open sql3, conn, 3, 3 
if Not rs3.eof then
if len(rs3("ShowName")) > 1 or len(rs3("Placing")) > 1 or len(rs3("Class")) > 1 then %>


<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "<%=screenwidth %>"><tr><td class = "roundedtopandbottom" align = "left">
<H2><div align = "left">Awards</div></H2>
<% rs3.close
		
sql3= "select * from Awards where Awards.ID = " & ID & " order by Placing asc"
Set rs3 = Server.CreateObject("ADODB.Recordset")
'response.write(sql3)
rs3.Open sql3, conn, 3, 3 

While Not rs3.eof  
If Len(rs3("ShowName")) > 2 then
AwardYear = rs3("AwardYear") 
aShow = rs3("Showname") 
aPlacing= rs3("Placing") 
aClass	= rs3("Type") 
Awardcomments		= rs3("Awardcomments") 
If AwardYear = "0" Then
AwardYear = ""
End If 
If aShow = "0" Then
aShow = ""
End If 
%>
<% if even = true then
even = false  %>
<table border="0" cellspacing="0"  align = "center" width = "100%" bgcolor = "#F2F2F2">
<% else 
even = true %>
<table border="0" cellspacing="0"  align = "center" width = "100%" bgcolor = "white">
<% end if %>
<tr>	
<td align = "center" class = "body"  valign = "top" width = "160"><%=aPlacing%></td>
<td align = "center" class = "body"  valign = "top" align = "left" width = "60"><%=AClass%> </td>
<td class = "body" valign = "top" width = "60"><%=AwardYear%> </td>	
<td class = "body" valign = "top" align = "left" width= "420"><%=aShow%> </td>	
</tr>
		
<% If Len(awardcomments) > 2 Then %>
<tr><td class = "body"  valign = "top" align = "left" colspan = "4"><%=Awardcomments%> </td></tr>
<% End If %>

</table>		   		     
 <%
 End if
rs3.movenext
Wend %>
</td>
</tr>
</table>
<br />

<%End if%>
<%End if%>	

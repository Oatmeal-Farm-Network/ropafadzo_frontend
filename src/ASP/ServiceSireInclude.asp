<% 
If len(DueDate) > 3 and Bred = 1 then 

if len(ServiceSireID) > 0 and (not ServiceSireID = 0) then
			
sqls = "select Animals.FullName, Animals.*, colors.*, Photos.*, Animalregistration.RegNumber from Animals, Photos, Colors, Animalregistration where Animals.ID =  colors.ID and  Animals.ID = Photos.ID and Animals.AnimalRegistrationID =  Animalregistration.AnimalRegistrationID and animals.ID =" & ServiceSireID
'response.write("sqls=" & sqls )
Set rss = Server.CreateObject("ADODB.Recordset")
rss.Open sqls, conn, 3, 3 
if not rss.eof then
			ServiceSireName = rss("FullName")
			ServiceSireColor1 = rss("Color1")
			ServiceSireImage 	=  rss("Photo1")
            ExternalStudRegistrationID1 = rss("Regnumber")
			If Len(ServiceSireImage) < 3 Then
				ServiceSireImage = "/uploads/ImageNotAvailable.jpg" 
			end If 

			rss.close
			set rss=nothing
			set conns = nothing
            studlink = "StudDetails.asp?ID=" & ServiceSireID
			sireclick =  "<a href ='StudDetails.asp?ID=" & ServiceSireID & "&DetailType=Sire' 	class = 'body'><img src=""" & ServiceSireImage & """ border=0  width=115></a>"
			sirenameclick = "<a href ='StudDetails.asp?ID=" & ServiceSireID & "&DetailType=Sire' 	class = 'body' >" & ServiceSireName & "</a>"
target = ""
end if

else if Len(Externalstudname) > 0  then 
ServiceSireName = Externalstudname
ServiceSireColor1 = ExternalStudColor
ServiceSireImage  =  ExternalStudPhoto 
studlink ="http://" & ExternalStudLink
target = "target=_blank"
end if
end if

str1 = ServiceSireName 
str2 = """"
If InStr(str1,str2) > 0 Then
ServiceSireName = Replace(str1, """", "'" )
End If


%>

<% if len(ServiceSireName) > 2 then %>
<table border="0" cellspacing="2" align = "center" width = "300">
<tr><td class = "body" align ="left"  height = "1" colspan = "3"><h3>Service Sire</h3>	</td></tr>
<tr><td align="center" valign = "top" class = "body"><% if not (gender = "male") then %>
<table valign="top"><tr>
<% if len(ServiceSireImage) > 4 then  %>
<td><table border = "0"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  >
<tr><td><% if len(studlink) > 4 then %>
<a href = "<%=studlink %>" class = "body" <%=target %>>
<% end if %>
<img src = "<%=ServiceSireImage%>" border = "0" width="100">
<% if len(studlink) > 4 then %>
</a>
<% end if %>
</td></tr></table>
</td>
<% end if %>
<td  valign="top"  class = "body">
<b><%=ServiceSireName%></b><br>
Color: 
<% if len(ServiceSireColor1) > 1 then  %>
<%=ServiceSireColor1 %> 
<% end if %>
 <% if len(ServiceSireColor2) > 1 then  %>
<%=ServiceSireColor2 %> 
<% end if %>
<% if len(ServiceSireColor4) > 1 then  %>
<%=ServiceSireColor4 %> 
<% end if %>
<% if len(ServiceSireColor5) > 1 then  %>
<%=ServiceSireColor5 %> 
<% end if %><br>
<% If Len(DueDate) > 3 Then %>
Due: <%=DueDate%><br>
<% End If %>
<% if len(studlink) > 4 then %>
<a href = "<%=studlink %>" <%=target %> class = "body">Learn More...</a>
<% end if %>
</td></tr></table>
</td></tr></table>
<%end if%>
<%end if%>
<% end if %>